'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="w-full max-w-2xl bg-surface/90 dark:bg-slate-950/90 backdrop-blur-xl border border-secondary/15 dark:border-white/10 rounded-[32px] shadow-2xl shadow-primary/5 overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
          >
            {/* Top Glow Ornament */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[1px]" />
            
            {/* Header */}
            <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-surface/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-secondary hover:text-foreground hover:bg-secondary/10 transition-all cursor-pointer flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-surface/20 dark:bg-slate-950/20">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
