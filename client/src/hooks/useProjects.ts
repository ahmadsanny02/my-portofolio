'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { Project, ApiResponse } from 'types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get<ApiResponse<Project[]>>('/projects');
        if (response.data.success) {
          setProjects(response.data.data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
