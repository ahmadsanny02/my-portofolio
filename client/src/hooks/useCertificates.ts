'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { Certificate, ApiResponse } from 'types';

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const response = await api.get<ApiResponse<Certificate[]>>('/certificates');
        if (response.data.success) {
          setCertificates(response.data.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  return { certificates, loading, error };
}
