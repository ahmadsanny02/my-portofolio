"use client";
import React from "react";

type Day = { date: string; contributionCount: number; color: string; weekday: number };
type Week = { contributionDays: Day[] };
type Calendar = { weeks: Week[]; colors: string[]; totalContributions: number };

function toLocalDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const GithubContributionComponent = ({
    user,
    includePrivate = true, // tidak dipakai server, tapi biar API call mudah diganti nanti
    box = 11,
    gap = 2,
    radius = 3,
    emptyLight = "#ebedf0",
    emptyDark = "#161b22",
}: {
    user: string;
    includePrivate?: boolean;
    box?: number;
    gap?: number;
    radius?: number;
    emptyLight?: string;
    emptyDark?: string;
}) => {
    const [cal, setCal] = React.useState<Calendar | null>(null);
    const [err, setErr] = React.useState<string | null>(null);
    const [empty, setEmpty] = React.useState<string>(emptyLight);

    React.useEffect(() => {
        const u = (user ?? "").trim();
        if (!u) {
            setErr("Missing GitHub username");
            return;
        }
        (async () => {
            try {
                const r = await fetch(`/api/contributions?user=${encodeURIComponent(u)}`);
                const data: unknown = await r.json();
                if (!r.ok) {
                    const msg =
                        typeof (data as { error?: unknown })?.error === "string"
                            ? (data as { error?: string }).error
                            : JSON.stringify((data as { error?: unknown })?.error ?? data);
                    throw new Error(msg || "Failed to load contributions");
                }
                setCal(data as Calendar);
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                setErr(msg);
            }
        })();
    }, [user, includePrivate]);

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => setEmpty(mq.matches ? emptyDark : emptyLight);
        apply();
        mq.addEventListener?.("change", apply);
        return () => mq.removeEventListener?.("change", apply);
    }, [emptyDark, emptyLight]);

    if (err) return <div className="text-red-500 text-sm mt-5">Error: {err}</div>;
    if (!cal) return <div className="text-sm opacity-70 mt-5">Loading contributions…</div>;

    const todayLocal = toLocalDay(new Date());

    return (
        <div className="">
            
            <div className="overflow-auto mt-5">
                <div className="flex flex-col gap-2">
                    <div className="text-sm opacity-80">
                        {user} — {cal.totalContributions.toLocaleString()} contributions (12 bulan terakhir)
                    </div>

                    <div
                        className="grid"
                        style={{ gridTemplateColumns: `repeat(${cal.weeks.length}, ${box + gap}px)`, gap }}
                        role="img"
                        aria-label={`Kalender kontribusi GitHub ${user} (hari lokal)`}
                    >
                        {cal.weeks.map((w, x) => {
                            const daysShown = [...w.contributionDays]
                                .sort((a, b) => a.weekday - b.weekday)
                                .filter((d) => toLocalDay(new Date(d.date)) <= todayLocal);

                            return (
                                <div key={x} className="flex flex-col" style={{ gap }}>
                                    {daysShown.map((day, y) => {
                                        const title = `${day.date} — ${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`;
                                        return (
                                            <div
                                                key={y}
                                                title={title}
                                                aria-label={title}
                                                style={{
                                                    width: box,
                                                    height: box,
                                                    background: day.color || empty,
                                                    borderRadius: radius,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 text-xs opacity-70">
                        Less
                        <div className="flex gap-1">
                            {[empty, ...cal.colors].map((c, i) => (
                                <span key={i} style={{ width: box, height: box, background: c, borderRadius: 2, display: "inline-block" }} />
                            ))}
                        </div>
                        More
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GithubContributionComponent