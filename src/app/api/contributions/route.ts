import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com/graphql";
const TOKEN = process.env.GITHUB_TOKEN;

const QUERY_DEFAULT = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          colors
          weeks {
            contributionDays {
              date
              contributionCount
              color
              weekday
            }
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
            contributionDays {
              date
              contributionCount
              color
              weekday
            }
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
  const login = searchParams.get("user") || "octocat";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const useRange = Boolean(from && to);
  const query = useRange ? QUERY_WITH_RANGE : QUERY_DEFAULT;

  if (useRange && (isNaN(Date.parse(from!)) || isNaN(Date.parse(to!)))) {
    return NextResponse.json({ error: "Invalid 'from' or 'to' datetime" }, { status: 400 });
  }

  const body: any = { query, variables: { login } };
  if (useRange) {
    const end = new Date(to!);
    end.setUTCHours(23, 59, 59, 999);
    body.variables.from = new Date(from!).toISOString();
    body.variables.to = end.toISOString();
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

    const json = await resp.json();
    if (Array.isArray(json.errors) && json.errors.length) {
      const messages = json.errors.map((e: any) => e?.message ?? JSON.stringify(e));
      return NextResponse.json({ error: `GraphQL error: ${messages.join(" | ")}` }, { status: 502 });
    }

    const node = json?.data?.user?.contributionsCollection;
    const payload = node?.contributionCalendar;
    if (!payload) return NextResponse.json({ error: "No contribution data" }, { status: 502 });

    return NextResponse.json(
      { ...payload, restrictedContributionsCount: node.restrictedContributionsCount },
      { headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate=3600" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
