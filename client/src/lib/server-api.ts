import { cache } from 'react';
import type { ApiResponse, Project } from 'types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Seconds before server-rendered public data is refreshed (ISR). */
export const PUBLIC_REVALIDATE_SECONDS = 60;

/**
 * Fetch a public list for server rendering. Returns `undefined` on failure so
 * the client component falls back to fetching in the browser.
 */
export async function fetchPublicList<T>(path: string): Promise<T[] | undefined> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });
    if (!res.ok) return undefined;
    const body: ApiResponse<T[]> = await res.json();
    return body.success ? (body.data ?? []) : undefined;
  } catch (error) {
    console.error(`[server-api] ${path}:`, error);
    return undefined;
  }
}

/**
 * Deduplicated per request via React `cache`, so `generateMetadata` and the
 * page share a single network call.
 */
export const fetchProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const res = await fetch(`${API_URL}/projects/${encodeURIComponent(slug)}`, {
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body: ApiResponse<Project> = await res.json();
    return body.data ?? null;
  } catch (error) {
    console.error('[server-api] project:', error);
    return null;
  }
});
