'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading, user } = useAuth({ redirectToDashboardIfLoggedIn: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent flicker: show loading or nothing while session is being checked
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-primary/20 blur-[150px] pointer-events-none animate-[pulse_10s_infinite]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-accent/20 blur-[150px] pointer-events-none animate-[pulse_12s_infinite]" />

      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-all duration-300 hover:-translate-x-1 group">
          <ArrowLeft size={20} className="group-hover:text-primary transition-colors" /> 
          <span className="font-semibold text-sm group-hover:text-primary transition-colors">Back to site</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="glass border border-secondary/15 rounded-[32px] p-8 sm:p-10 shadow-2xl relative">
          {/* Card Border Highlight effect */}
          <div className="absolute -inset-px rounded-[32px] bg-gradient-to-tr from-primary/20 via-transparent to-accent/25 opacity-30 pointer-events-none" />

          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="bg-gradient-to-tr from-primary to-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-primary/25"
            >
              <Lock size={28} />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-secondary bg-clip-text text-transparent">Admin Portal</h1>
            <p className="text-secondary text-sm mt-2">Sign in to manage your professional portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface/50 dark:bg-background/40 border border-secondary/15 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-secondary/50"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface/50 dark:bg-background/40 border border-secondary/15 rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-secondary/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
