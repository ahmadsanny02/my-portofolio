'use client';

import type { Skill } from 'types';
import { useApiList } from './useApiList';

export function useSkills({ initialData }: { initialData?: Skill[] } = {}) {
  const { data, loading, error, refresh } = useApiList<Skill>('/skills', { initialData });
  return { skills: data, loading, error, refresh };
}
