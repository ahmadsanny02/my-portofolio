import type {
  ContributionDay,
  ContributionLevel,
  GithubActivity,
  GithubCommit,
} from 'types';
import { IGithubActivityProvider } from '../../domain/repositories/IGithubActivityProvider';
import { AppError } from '../../shared/errors/AppError';

const GRAPHQL_URL = 'https://api.github.com/graphql';
const REST_URL = 'https://api.github.com';
/** GitHub rejects requests without a User-Agent; keep it generic. */
const USER_AGENT = 'portfolio-activity-widget';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_COMMITS = 8;
const REST_REPO_LIMIT = 4;

const CONTRIBUTION_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const ACTIVITY_QUERY = `
  query PortfolioActivity($login: String!) {
    user(login: $login) {
      login
      url
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
      repositories(
        first: 6
        orderBy: { field: PUSHED_AT, direction: DESC }
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
      ) {
        nodes {
          nameWithOwner
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 5) {
                  nodes {
                    oid
                    messageHeadline
                    committedDate
                    url
                    author { user { login } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Upstream response shapes (only the fields we read) ──────────────────────

interface GraphqlCommitNode {
  oid: string;
  messageHeadline: string;
  committedDate: string;
  url: string;
  author: { user: { login: string } | null } | null;
}

interface GraphqlRepositoryNode {
  nameWithOwner: string;
  defaultBranchRef: {
    target: { history?: { nodes: GraphqlCommitNode[] } } | null;
  } | null;
}

export interface GraphqlUser {
  login: string;
  url: string;
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: {
        contributionDays: {
          date: string;
          contributionCount: number;
          contributionLevel: string;
        }[];
      }[];
    };
  };
  repositories: { nodes: (GraphqlRepositoryNode | null)[] };
}

interface RestRepository {
  full_name: string;
  fork: boolean;
}

export interface RestCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
}

// ── Pure mappers (exported for unit tests) ──────────────────────────────────

function byNewest(a: GithubCommit, b: GithubCommit): number {
  return b.date.localeCompare(a.date);
}

/** Maps the GraphQL `user` node to the public activity payload. */
export function mapGraphqlUser(user: GraphqlUser, fetchedAt: string): GithubActivity {
  const calendar = user.contributionsCollection.contributionCalendar;
  const ownLogin = user.login.toLowerCase();

  const weeks: ContributionDay[][] = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
    })),
  );

  const recentCommits: GithubCommit[] = [];
  for (const repo of user.repositories.nodes) {
    const commits = repo?.defaultBranchRef?.target?.history?.nodes ?? [];
    for (const commit of commits) {
      // Keep the owner's commits; commits whose e-mail is not linked to any
      // account have no `user` and are treated as the owner's local identity.
      const authorLogin = commit.author?.user?.login.toLowerCase();
      if (authorLogin && authorLogin !== ownLogin) continue;
      recentCommits.push({
        sha: commit.oid,
        message: commit.messageHeadline,
        repo: repo!.nameWithOwner,
        url: commit.url,
        date: commit.committedDate,
      });
    }
  }

  return {
    username: user.login,
    profileUrl: user.url,
    totalContributions: calendar.totalContributions,
    weeks,
    recentCommits: recentCommits.sort(byNewest).slice(0, MAX_COMMITS),
    fetchedAt,
  };
}

/** Maps REST commit lists (token-less fallback) to the public activity payload. */
export function mapRestCommits(
  username: string,
  commitsByRepo: { repo: string; commits: RestCommit[] }[],
  fetchedAt: string,
): GithubActivity {
  const recentCommits = commitsByRepo
    .flatMap(({ repo, commits }) =>
      commits.map((item) => ({
        sha: item.sha,
        message: item.commit.message.split('\n')[0] ?? '',
        repo,
        url: item.html_url,
        date: item.commit.author?.date ?? '',
      })),
    )
    .filter((commit) => commit.date !== '')
    .sort(byNewest)
    .slice(0, MAX_COMMITS);

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    totalContributions: null,
    weeks: null,
    recentCommits,
    fetchedAt,
  };
}

// ── Provider ────────────────────────────────────────────────────────────────

/**
 * Reads public GitHub activity.
 *
 * With a token it uses GraphQL (contribution calendar + recent commits in one
 * request). Without one it falls back to the unauthenticated REST API, which
 * exposes commits but not the contribution calendar and is limited to
 * 60 requests/hour per IP — hence the caching in the use case.
 */
export class GithubApiProvider implements IGithubActivityProvider {
  constructor(
    private token: string | undefined = process.env.GITHUB_TOKEN,
    private fetchImpl: typeof fetch = fetch,
  ) {}

  async fetchActivity(username: string): Promise<GithubActivity> {
    return this.token
      ? this.fetchWithGraphql(username, this.token)
      : this.fetchWithRest(username);
  }

  private async fetchWithGraphql(username: string, token: string): Promise<GithubActivity> {
    const response = await this.request(GRAPHQL_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: ACTIVITY_QUERY, variables: { login: username } }),
    });

    const body = (await response.json()) as {
      data?: { user: GraphqlUser | null };
      errors?: { message: string }[];
    };

    if (body.errors?.length || !body.data?.user) {
      console.error('[GitHub] GraphQL error:', body.errors?.[0]?.message ?? 'user not found');
      throw new AppError('GitHub activity is unavailable', 502);
    }

    return mapGraphqlUser(body.data.user, new Date().toISOString());
  }

  private async fetchWithRest(username: string): Promise<GithubActivity> {
    const login = encodeURIComponent(username);
    const reposResponse = await this.request(
      `${REST_URL}/users/${login}/repos?sort=pushed&type=owner&per_page=10`,
    );
    const repos = ((await reposResponse.json()) as RestRepository[])
      .filter((repo) => !repo.fork)
      .slice(0, REST_REPO_LIMIT);

    const commitsByRepo = await Promise.all(
      repos.map(async (repo) => {
        const response = await this.request(
          `${REST_URL}/repos/${repo.full_name}/commits?per_page=3`,
        );
        return { repo: repo.full_name, commits: (await response.json()) as RestCommit[] };
      }),
    );

    return mapRestCommits(username, commitsByRepo, new Date().toISOString());
  }

  private async request(url: string, init: RequestInit = {}): Promise<Response> {
    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        ...init,
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': USER_AGENT,
          'X-GitHub-Api-Version': '2022-11-28',
          ...init.headers,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      console.error('[GitHub] request failed:', error instanceof Error ? error.message : error);
      throw new AppError('GitHub activity is unavailable', 502);
    }

    if (!response.ok) {
      console.error(`[GitHub] ${response.status} for ${new URL(url).pathname}`);
      throw new AppError('GitHub activity is unavailable', 502);
    }
    return response;
  }
}
