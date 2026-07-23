'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api-client';
import { Category, ApiResponse } from 'types';

export function useCategories(type?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const url = type ? `/categories?type=${type}` : '/categories';
      const response = await api.get<ApiResponse<Category[]>>(url);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refresh: fetchCategories };
}
