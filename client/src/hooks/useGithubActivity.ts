'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import type { ApiResponse, GithubActivity } from 'types';

/** The API snapshot is refreshed upstream every 10 minutes; polling faster returns cached data. */
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export interface GithubActivityState {
  data: GithubActivity | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  /** Client timestamp of the last successful load; relative times are rendered against it. */
  loadedAt: number;
}

/**
 * Loads GitHub activity once `enabled` turns true (the widget scrolled into
 * view) and keeps it fresh while the tab is visible. A failed refresh keeps
 * showing the previous data.
 */
export function useGithubActivity(enabled: boolean): GithubActivityState {
  const [state, setState] = useState<GithubActivityState>({ data: null, status: 'idle', loadedAt: 0 });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    const load = async () => {
      setState((previous) => (previous.data ? previous : { ...previous, status: 'loading' }));
      try {
        const response = await api.get<ApiResponse<GithubActivity>>('/github/activity', {
          signal: controller.signal,
        });
        const data = response.data.data;
        if (!response.data.success || !data) throw new Error('Empty response');
        setState({ data, status: 'ready', loadedAt: Date.now() });
      } catch {
        if (controller.signal.aborted) return;
        setState((previous) => (previous.data ? previous : { ...previous, status: 'error' }));
      }
    };

    load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, REFRESH_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [enabled]);

  return state;
}
