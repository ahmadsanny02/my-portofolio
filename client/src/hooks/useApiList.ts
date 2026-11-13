'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api-client';
import { getApiError } from '@/lib/api-error';
import type { ApiResponse } from 'types';

interface UseApiListOptions<T> {
  /** Server-rendered data: when provided, the initial fetch is skipped. */
  initialData?: T[];
  params?: Record<string, string | undefined>;
}

/** Shared list-fetching hook with abort-on-unmount and manual refresh. */
export function useApiList<T>(path: string, { initialData, params }: UseApiListOptions<T> = {}) {
  const [data, setData] = useState<T[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const paramsKey = JSON.stringify(params ?? {});

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ApiResponse<T[]>>(path, {
          params: JSON.parse(paramsKey),
          signal,
        });
        if (response.data.success) setData(response.data.data || []);
      } catch (err) {
        if (signal?.aborted) return;
        setError(getApiError(err, 'Failed to load data'));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [path, paramsKey],
  );

  const skipInitial = initialData !== undefined;
  useEffect(() => {
    if (skipInitial) return;
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, skipInitial]);

  const refresh = useCallback(() => fetchData(), [fetchData]);

  return { data, setData, loading, error, refresh };
}
