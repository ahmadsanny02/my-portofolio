'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useInView } from 'framer-motion';
import { ExternalLink, GitCommitHorizontal, Github } from 'lucide-react';
import type { ContributionDay, GithubActivity as GithubActivityData } from 'types';
import { profile } from '@/data/profile';
import { useGithubActivity } from '@/hooks/useGithubActivity';

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LABEL_HEIGHT = 18;
const LEVEL_OPACITY = [0, 0.3, 0.5, 0.75, 1] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MAX_COMMITS = 6;

const numberFormat = new Intl.NumberFormat('en-US');
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const utcDate = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`);

function relativeTime(iso: string, now: number): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

/** Month labels above the first week in which each month starts. */
function monthLabels(weeks: ContributionDay[][]): { index: number; label: string }[] {
  const labels: { index: number; label: string }[] = [];
  let previousMonth = -1;
  weeks.forEach((week, index) => {
    const first = week[0];
    if (!first) return;
    const month = utcDate(first.date).getUTCMonth();
    if (month === previousMonth) return;
    previousMonth = month;
    // Skip a label that would collide with the previous one
    const last = labels[labels.length - 1];
    if (!last || index - last.index >= 3) labels.push({ index, label: MONTHS[month] });
  });
  return labels;
}

function ContributionCalendar({ weeks, total }: { weeks: ContributionDay[][]; total: number | null }) {
  const scroller = useRef<HTMLDivElement>(null);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);
  const width = weeks.length * STEP - GAP;
  const height = LABEL_HEIGHT + 7 * STEP - GAP;

  // On narrow screens start at the most recent weeks
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, [weeks]);

  const summary =
    total !== null
      ? `${numberFormat.format(total)} contributions in the last year`
      : 'Contribution calendar for the last year';

  return (
    <div ref={scroller} className="overflow-x-auto pb-2" tabIndex={0} role="group" aria-label={summary}>
      {/* Scales up to the card width on large screens; scrolls horizontally below its natural size */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        className="block h-auto w-full"
        style={{ minWidth: width }}
      >
        {labels.map(({ index, label }) => (
          <text key={index} x={index * STEP} y={11} fontSize={10} fill="var(--secondary)" aria-hidden="true">
            {label}
          </text>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((day) => (
            <rect
              key={day.date}
              x={weekIndex * STEP}
              y={LABEL_HEIGHT + utcDate(day.date).getUTCDay() * STEP}
              width={CELL}
              height={CELL}
              rx={3}
              fill={day.level === 0 ? 'var(--secondary)' : 'var(--primary)'}
              fillOpacity={day.level === 0 ? 0.15 : LEVEL_OPACITY[day.level]}
            >
              <title>
                {`${day.count} contribution${day.count === 1 ? '' : 's'} on ${dateFormat.format(utcDate(day.date))}`}
              </title>
            </rect>
          )),
        )}
      </svg>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary" aria-hidden="true">
      <span>Less</span>
      {LEVEL_OPACITY.map((opacity, level) => (
        <span
          key={level}
          className="h-3 w-3 rounded-[3px]"
          style={{
            backgroundColor: level === 0 ? 'var(--secondary)' : 'var(--primary)',
            opacity: level === 0 ? 0.15 : opacity,
          }}
        />
      ))}
      <span>More</span>
    </div>
  );
}

function RecentCommits({ activity, now }: { activity: GithubActivityData; now: number }) {
  const commits = activity.recentCommits.slice(0, MAX_COMMITS);
  if (commits.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-secondary">Latest commits</h4>
      <ul className="grid gap-2 md:grid-cols-2">
        {commits.map((commit) => (
          <li key={commit.sha}>
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] items-start gap-3 rounded-2xl border border-secondary/10 bg-background/60 p-3 transition-colors hover:border-primary/30"
            >
              <GitCommitHorizontal size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground group-hover:text-primary">
                  {commit.message}
                </span>
                <span className="block truncate text-xs text-secondary">
                  {commit.repo.split('/')[1] ?? commit.repo} · {relativeTime(commit.date, now)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** GitHub's calendar always spans 53 weeks; used to reserve space before data arrives. */
const CALENDAR_SIZE = { width: 53 * STEP - GAP, height: LABEL_HEIGHT + 7 * STEP - GAP } as const;

/**
 * Placeholder with the same geometry as the loaded widget, so content below
 * does not shift when the data arrives (no layout shift, stable scroll
 * restoration).
 */
function Skeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div>
        <div className="overflow-x-auto pb-2">
          <div
            className="w-full animate-pulse rounded-2xl bg-secondary/10"
            style={{
              minWidth: CALENDAR_SIZE.width,
              aspectRatio: `${CALENDAR_SIZE.width} / ${CALENDAR_SIZE.height}`,
            }}
          />
        </div>
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-secondary/10" />
      </div>
      <div>
        <div className="mb-3 h-4 w-32 animate-pulse rounded bg-secondary/10" />
        <div className="grid gap-2 md:grid-cols-2">
          {Array.from({ length: MAX_COMMITS }, (_, item) => (
            <div key={item} className="h-[62px] animate-pulse rounded-2xl bg-secondary/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Live GitHub activity: contribution calendar and latest commits.
 * Data is requested only once the widget is about to enter the viewport and
 * comes from the portfolio API, which holds the GitHub token server-side.
 */
export default function GithubActivity() {
  const container = useRef<HTMLDivElement>(null);
  const visible = useInView(container, { once: true, margin: '200px 0px' });
  const { data, status, loadedAt } = useGithubActivity(visible);
  const profileUrl = data?.profileUrl ?? profile.socials.github;
  const username = data?.username ?? profile.socials.github.split('/').pop();

  return (
    <div
      ref={container}
      className="mt-16 rounded-card border border-secondary/10 bg-surface/60 p-6 shadow-sm backdrop-blur-md sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Github size={22} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-extrabold leading-tight text-foreground">GitHub Activity</h3>
            <p className="text-sm text-secondary" aria-live="polite">
              {data
                ? data.totalContributions !== null
                  ? `${numberFormat.format(data.totalContributions)} contributions in the last year`
                  : 'Latest public commits'
                : status === 'error'
                  ? 'Activity is unavailable right now'
                  : 'Loading activity…'}
            </p>
          </div>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-secondary/15 px-4 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          @{username}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      {data ? (
        <div className="space-y-6">
          {data.weeks && (
            <div>
              <ContributionCalendar weeks={data.weeks} total={data.totalContributions} />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-[11px] font-medium text-secondary">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live from GitHub · synced {relativeTime(data.fetchedAt, loadedAt)}
                </p>
                <Legend />
              </div>
            </div>
          )}
          <RecentCommits activity={data} now={loadedAt} />
        </div>
      ) : status === 'error' ? (
        <p className="text-sm text-secondary">
          GitHub could not be reached. You can still browse the profile directly using the link above.
        </p>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
