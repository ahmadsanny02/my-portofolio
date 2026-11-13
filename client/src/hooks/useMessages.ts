'use client';

import api from '@/lib/api-client';
import { getApiError } from '@/lib/api-error';
import type { ContactMessage } from 'types';
import { useApiList } from './useApiList';

export function useMessages() {
  const { data: messages, setData, loading, error, refresh } = useApiList<ContactMessage>('/contact');

  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      setData((prev) => prev.filter((msg) => msg.id !== id));
      return { success: true as const };
    } catch (err) {
      return { success: false as const, error: getApiError(err, 'Failed to delete message') };
    }
  };

  const setRead = async (id: string, isRead = true) => {
    try {
      await api.patch(`/contact/${id}/read`, { isRead });
      setData((prev) => prev.map((msg) => (msg.id === id ? { ...msg, isRead } : msg)));
      return { success: true as const };
    } catch (err) {
      return { success: false as const, error: getApiError(err, 'Failed to update message') };
    }
  };

  return { messages, loading, error, fetchMessages: refresh, deleteMessage, setRead };
}
