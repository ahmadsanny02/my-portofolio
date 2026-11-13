'use client';

import type { Certificate } from 'types';
import { useApiList } from './useApiList';

export function useCertificates({ initialData }: { initialData?: Certificate[] } = {}) {
  const { data, loading, error, refresh } = useApiList<Certificate>('/certificates', { initialData });
  return { certificates: data, loading, error, refresh };
}
