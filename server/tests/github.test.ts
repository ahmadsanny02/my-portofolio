import { describe, it, expect, vi } from 'vitest';
import type { GithubActivity } from 'types';
import {
  GithubApiProvider,
  mapGraphqlUser,
  mapRestCommits,
  type GraphqlUser,
} from '../src/infrastructure/github/GithubApiProvider';
import { GetGithubActivityUseCase } from '../src/application/use-cases/github/GetGithubActivityUseCase';

const commit = (oid: string, date: string, login: string | null) => ({
  oid,
  messageHeadline: `commit ${oid}`,
  committedDate: date,
  url: `https://github.com/o/r/commit/${oid}`,
  author: { user: login ? { login } : null },
});

const graphqlUser: GraphqlUser = {
  login: 'Octo',
  url: 'https://github.com/Octo',
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: 42,
      weeks: [
        {
          contributionDays: [
            { date: '2026-01-01', contributionCount: 0, contributionLevel: 'NONE' },
            { date: '2026-01-02', contributionCount: 9, contributionLevel: 'FOURTH_QUARTILE' },
            { date: '2026-01-03', contributionCount: 1, contributionLevel: 'SOMETHING_NEW' },
          ],
        },
      ],
    },
  },
  repositories: {
    nodes: [
      {
        nameWithOwner: 'Octo/alpha',
        defaultBranchRef: {
          target: {
            history: {
              nodes: [
                commit('a1', '2026-01-02T10:00:00Z', 'octo'),
                commit('a2', '2026-01-01T10:00:00Z', 'someone-else'),
                commit('a3', '2025-12-30T10:00:00Z', null),
              ],
            },
          },
        },
      },
      null,
      { nameWithOwner: 'Octo/empty', defaultBranchRef: null },
      {
        nameWithOwner: 'Octo/beta',
        defaultBranchRef: {
          target: { history: { nodes: [commit('b1', '2026-01-03T10:00:00Z', 'Octo')] } },
        },
      },
    ],
  },
};

describe('mapGraphqlUser', () => {
  const activity = mapGraphqlUser(graphqlUser, '2026-01-04T00:00:00.000Z');

  it('maps the contribution calendar and unknown levels', () => {
    expect(activity.totalContributions).toBe(42);
    expect(activity.weeks).toEqual([
      [
        { date: '2026-01-01', count: 0, level: 0 },
        { date: '2026-01-02', count: 9, level: 4 },
        { date: '2026-01-03', count: 1, level: 0 },
      ],
    ]);
  });

  it('keeps own and unlinked commits, newest first, across repositories', () => {
    expect(activity.recentCommits.map((c) => c.sha)).toEqual(['b1', 'a1', 'a3']);
    expect(activity.recentCommits[0]).toMatchObject({ repo: 'Octo/beta', message: 'commit b1' });
  });
});

describe('mapRestCommits', () => {
  it('uses the first message line and reports the calendar as unavailable', () => {
    const activity = mapRestCommits(
      'octo',
      [
        {
          repo: 'octo/alpha',
          commits: [
            {
              sha: 's1',
              html_url: 'https://github.com/octo/alpha/commit/s1',
              commit: { message: 'feat: title\n\nbody', author: { date: '2026-01-02T00:00:00Z' } },
            },
            { sha: 's2', html_url: 'u', commit: { message: 'no date', author: null } },
          ],
        },
      ],
      'now',
    );
    expect(activity.weeks).toBeNull();
    expect(activity.totalContributions).toBeNull();
    expect(activity.recentCommits).toEqual([
      {
        sha: 's1',
        message: 'feat: title',
        repo: 'octo/alpha',
        url: 'https://github.com/octo/alpha/commit/s1',
        date: '2026-01-02T00:00:00Z',
      },
    ]);
  });
});

describe('GithubApiProvider', () => {
  it('queries GraphQL with the token and never leaks it in the payload', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ data: { user: graphqlUser } }), { status: 200 }),
    );
    const provider = new GithubApiProvider('secret-token', fetchImpl as unknown as typeof fetch);
    const activity = await provider.fetchActivity('Octo');

    expect(activity.username).toBe('Octo');
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.github.com/graphql');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer secret-token');
    expect(JSON.stringify(activity)).not.toContain('secret-token');
  });

  it('maps upstream failures to a 502 without exposing details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchImpl = vi.fn(async () => new Response('rate limited', { status: 403 }));
    const provider = new GithubApiProvider(undefined, fetchImpl as unknown as typeof fetch);
    await expect(provider.fetchActivity('octo')).rejects.toMatchObject({
      statusCode: 502,
      message: 'GitHub activity is unavailable',
    });
  });
});

describe('GetGithubActivityUseCase', () => {
  const snapshot = (tag: string): GithubActivity => ({
    username: tag,
    profileUrl: '',
    totalContributions: null,
    weeks: null,
    recentCommits: [],
    fetchedAt: tag,
  });

  it('caches within the TTL and shares concurrent requests', async () => {
    let now = 0;
    const fetchActivity = vi.fn(async () => snapshot(`v${fetchActivity.mock.calls.length}`));
    const useCase = new GetGithubActivityUseCase({ fetchActivity }, 'octo', 1000, () => now);

    const [a, b] = await Promise.all([useCase.execute(), useCase.execute()]);
    expect(a).toBe(b);
    expect(fetchActivity).toHaveBeenCalledTimes(1);

    now = 999;
    await useCase.execute();
    expect(fetchActivity).toHaveBeenCalledTimes(1);

    now = 1001;
    expect((await useCase.execute()).username).toBe('v2');
    expect(fetchActivity).toHaveBeenCalledTimes(2);
  });

  it('serves the stale snapshot when the upstream fails', async () => {
    let now = 0;
    const fetchActivity = vi
      .fn<() => Promise<GithubActivity>>()
      .mockResolvedValueOnce(snapshot('good'))
      .mockRejectedValueOnce(new Error('down'));
    const useCase = new GetGithubActivityUseCase({ fetchActivity }, 'octo', 1000, () => now);

    await useCase.execute();
    now = 5000;
    expect((await useCase.execute()).username).toBe('good');
  });

  it('propagates the error when there is nothing cached', async () => {
    const fetchActivity = vi.fn(async () => {
      throw new Error('down');
    });
    const useCase = new GetGithubActivityUseCase({ fetchActivity }, 'octo');
    await expect(useCase.execute()).rejects.toThrow('down');
  });
});
