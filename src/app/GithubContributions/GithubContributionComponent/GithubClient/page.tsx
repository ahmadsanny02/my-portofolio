"use client";
import dynamic from "next/dynamic";

// karena file GitHubContribHeatmap.tsx ada di folder yang sama (src/app/components)
const GitHubContributionComponent = dynamic(() => import("./../page"), {
    ssr: false,
});

export default function GitHubClient(
    props: { user: string; includePrivate?: boolean }
) {
    return <GitHubContributionComponent {...props} />;
}
