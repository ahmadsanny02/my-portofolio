"use client";
import dynamic from "next/dynamic";

// karena file GitHubContribHeatmap.tsx ada di folder yang sama (src/app/components)
const Heatmap = dynamic(() => import("./GitHubContribHeatmap"), {
    ssr: false,
});

export default function GitHubContribHeatmapClient(
    props: { user: string; includePrivate?: boolean }
) {
    return <Heatmap {...props} />;
}
