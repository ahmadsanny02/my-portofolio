'use client';

import type { Category } from 'types';
import { useApiList } from './useApiList';

export function useCategories(type?: string) {
  const { data, loading, error, refresh } = useApiList<Category>('/categories', {
    params: { type },
  });
  return { categories: data, loading, error, refresh };
}
