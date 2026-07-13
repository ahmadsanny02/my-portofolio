'use client';

import React, { useState } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';
import TableControls from '@/components/admin/TableControls';
import { showToast, showConfirm } from '@/lib/sweetalert';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 280, damping: 22 } 
  }
};

export default function AdminMessagesPage() {
  const { messages, loading, deleteMessage } = useMessages();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilterRead(val);
    setCurrentPage(1);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      filterRead === '' 
        ? true 
        : filterRead === 'read' 
          ? msg.isRead 
          : !msg.isRead;
          
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage) || 1;
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    const result = await showConfirm(
      'Are you sure?',
      'You are about to delete this message. This action cannot be undone.'
    );
    if (result.isConfirmed) {
      const deleteResult = await deleteMessage(id);
      if (deleteResult.success) {
        showToast('success', 'Message deleted');
      } else {
        showToast('error', 'Failed to delete message');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-secondary">Read and manage inquiries from your portfolio visitors.</p>
      </div>

      <div className="bg-surface/50 p-6 rounded-[32px] border border-secondary/10">
        <TableControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search messages..."
          filterValue={filterRead}
          onFilterChange={handleFilterChange}
          filterOptions={[
            { value: 'read', label: 'Read' },
            { value: 'unread', label: 'Unread' }
          ]}
          filterPlaceholder="All Statuses"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPagination={false}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="p-8 bg-surface rounded-[32px] border border-secondary/5 animate-pulse">
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
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-[32px] border border-secondary/5">
            <MessageSquare size={48} className="mx-auto text-secondary/30 mb-4" />
            <p className="text-secondary">No messages yet.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 w-full"
          >
            {paginatedMessages.map((msg) => (
              <motion.div 
                key={msg.id} 
                variants={itemVariants}
                className="p-6 sm:p-8 bg-surface/50 backdrop-blur-md rounded-[32px] border border-secondary/10 dark:border-white/5 shadow-md shadow-primary/[0.01] hover:shadow-lg transition-all duration-300 hover:border-primary/20 dark:hover:border-primary/10 group relative"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner">
                      <User size={24} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground truncate">{msg.name}</h3>
                        {!msg.isRead && (
                          <span className="relative flex h-2.5 w-2.5" title="Unread">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-secondary text-sm flex items-center gap-2 truncate mt-0.5">
                        <Mail size={14} className="flex-shrink-0" /> {msg.email}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> {formatDate(msg.created_at)}
                    </p>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="sm:mt-4 p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-60 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-background/40 dark:bg-slate-950/40 p-6 rounded-2xl border border-secondary/10 dark:border-white/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Subject: {msg.subject || 'No Subject'}</p>
                  <p className="text-secondary leading-relaxed text-sm">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-8 px-2">
        <TableControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredMessages.length}
          itemsPerPage={itemsPerPage}
          showSearchAndFilter={false}
        />
      </div>
    </div>
  );
}
