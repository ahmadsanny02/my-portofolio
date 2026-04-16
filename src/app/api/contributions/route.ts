import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com/graphql";
const TOKEN = process.env.GITHUB_TOKEN;

// ==== Types ====
type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
};
type ContributionCalendar = {
  totalContributions: number;
  colors: string[];
  weeks: { contributionDays: ContributionDay[] }[];
};
type ContributionsNode = {
  restrictedContributionsCount: number;
  contributionCalendar: ContributionCalendar;
};
type GraphQLErrorItem = { message?: string };
type GraphQLData = {
  user?: { contributionsCollection?: ContributionsNode };
};
type GraphQLResponse = { data?: GraphQLData; errors?: GraphQLErrorItem[] };

type VarsDefault = { login: string };
type VarsWithRange = { login: string; from: string; to: string };
type GraphQLRequestBody = { query: string; variables: VarsDefault | VarsWithRange };

// ==== Queries ====
const QUERY_DEFAULT = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          colors
          weeks {
            contributionDays { date contributionCount color weekday }
          }
        }
      }
    }
  }
`;

const QUERY_WITH_RANGE = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          colors
          weeks {
            contributionDays { date contributionCount color weekday }
          }
        }
      }
    }
  }
`;

export async function GET(req: Request) {
  if (!TOKEN) {
    return NextResponse.json({ error: "Missing GITHUB_TOKEN" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const rawUser = searchParams.get("user");
  const login =
    !rawUser || rawUser === "undefined" || rawUser === "null" || rawUser.trim() === ""
      ? "octocat"
      : rawUser.trim();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const useRange = Boolean(from && to);
  const query = useRange ? QUERY_WITH_RANGE : QUERY_DEFAULT;

  if (useRange && (Number.isNaN(Date.parse(from!)) || Number.isNaN(Date.parse(to!)))) {
    return NextResponse.json({ error: "Invalid 'from' or 'to' datetime" }, { status: 400 });
  }

  const body: GraphQLRequestBody = { query, variables: { login } };

  if (useRange) {
    const end = new Date(to!);
    end.setUTCHours(23, 59, 59, 999);
    (body.variables as VarsWithRange).from = new Date(from!).toISOString();
    (body.variables as VarsWithRange).to = end.toISOString();
  }

  try {
    const resp = await fetch(GITHUB_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `GitHub ${resp.status}: ${text}` }, { status: resp.status });
    }

    const json = (await resp.json()) as GraphQLResponse;

    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const messages = json.errors.map((e) => e.message ?? JSON.stringify(e));
      return NextResponse.json({ error: `GraphQL error: ${messages.join(" | ")}` }, { status: 502 });
    }

    const node = json.data?.user?.contributionsCollection;
    const payload = node?.contributionCalendar;

    if (!payload) {
      return NextResponse.json({ error: "No contribution data" }, { status: 502 });
    }

    return NextResponse.json(
      { ...payload, restrictedContributionsCount: node.restrictedContributionsCount },
      { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
