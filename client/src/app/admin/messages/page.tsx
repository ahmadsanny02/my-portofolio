'use client';

import React from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const { messages, loading, deleteMessage } = useMessages();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const result = await deleteMessage(id);
    if (result.success) {
      toast.success('Message deleted');
    } else {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-secondary">Read and manage inquiries from your portfolio visitors.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="p-8 bg-surface rounded-3xl border border-secondary/5 animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-secondary/10 rounded" />
                    <div className="h-4 w-48 bg-secondary/10 rounded" />
                  </div>
                </div>
                <div className="h-4 w-24 bg-secondary/10 rounded" />
              </div>
              <div className="h-24 bg-secondary/5 rounded-2xl" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-secondary/5">
            <MessageSquare size={48} className="mx-auto text-secondary/30 mb-4" />
            <p className="text-secondary">No messages yet.</p>
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className="p-6 sm:p-8 bg-surface rounded-3xl border border-secondary/5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <User size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate">{msg.name}</h3>
                  <p className="text-secondary text-sm flex items-center gap-2 truncate">
                    <Mail size={14} className="flex-shrink-0" /> {msg.email}
                  </p>
                </div>
              </div>
              <div className="sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                <p className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> {formatDate(msg.createdAt)}
                </p>
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="sm:mt-4 p-2 text-secondary hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                >
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
