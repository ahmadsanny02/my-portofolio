'use client';

import type { Project } from 'types';
import { useApiList } from './useApiList';

/**
 * @param admin  when true, fetches drafts too via the protected admin endpoint
 */
export function useProjects({ admin = false, initialData }: { admin?: boolean; initialData?: Project[] } = {}) {
  const { data, loading, error, refresh } = useApiList<Project>(
    admin ? '/projects/admin/all' : '/projects',
    { initialData },
  );
  return { projects: data, loading, error, refresh };
}
