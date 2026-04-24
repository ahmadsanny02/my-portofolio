'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';

export function useMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contact');
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { messages, loading, error, fetchMessages, deleteMessage };
}
