'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { Skill, ApiResponse } from 'types';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await api.get<ApiResponse<Skill[]>>('/skills');
        if (response.data.success) {
          setSkills(response.data.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return { skills, loading, error };
}
