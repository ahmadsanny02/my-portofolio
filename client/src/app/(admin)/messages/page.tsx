'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/contact');
        setMessages(data.data || []);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-secondary">Read and manage inquiries from your portfolio visitors.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-40 bg-secondary/10 rounded-3xl animate-pulse" />)
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-secondary/5">
            <MessageSquare size={48} className="mx-auto text-secondary/30 mb-4" />
            <p className="text-secondary">No messages yet.</p>
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className="p-8 bg-surface rounded-3xl border border-secondary/5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{msg.name}</h3>
                  <p className="text-secondary text-sm flex items-center gap-2">
                    <Mail size={14} /> {msg.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                  <Calendar size={14} /> {formatDate(msg.created_at)}
                </p>
                <button className="mt-4 p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-background/50 p-6 rounded-2xl border border-secondary/5">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Subject: {msg.subject}</p>
              <p className="text-secondary leading-relaxed">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
