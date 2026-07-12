'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { ContactMessage, ApiResponse } from 'types';

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<ContactMessage[]>>('/contact');
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  return { messages, loading, error, fetchMessages, deleteMessage };
}
