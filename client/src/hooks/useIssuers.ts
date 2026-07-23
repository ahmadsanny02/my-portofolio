'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api-client';
import { Issuer, ApiResponse } from 'types';

export function useIssuers() {
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssuers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Issuer[]>>('/issuers');
      if (response.data.success) {
        setIssuers(response.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssuers();
  }, [fetchIssuers]);

  return { issuers, loading, error, refresh: fetchIssuers };
}
