'use client';

import type { Issuer } from 'types';
import { useApiList } from './useApiList';

export function useIssuers() {
  const { data, loading, error, refresh } = useApiList<Issuer>('/issuers');
  return { issuers: data, loading, error, refresh };
}
