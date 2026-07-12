'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  Settings, 
  MessageSquare, 
  LogOut, 
  User,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Skills', href: '/admin/skills', icon: Settings },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (pathname === '/admin/login') return <>{children}</>;

  if (!user) return null; // Prevent rendering dashboard if not authenticated

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-surface/90 backdrop-blur-md border-b border-secondary/10 flex items-center justify-between px-6 sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary to-accent p-1.5 rounded-lg shadow-sm">
            <User size={18} className="text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">Admin<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Panel</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-secondary hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-surface/80 dark:bg-surface/60 backdrop-blur-md border-r border-secondary/10 flex flex-col fixed h-full z-40 transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2.5 mb-8 hover:opacity-90 transition-opacity">
            <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-xl shadow-lg shadow-primary/10">
              <User size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">Admin<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Panel</span></span>
          </Link>

          {/* User Profile Card */}
          {user && (
            <div className="mb-8 p-4 bg-background/40 border border-secondary/5 rounded-2xl flex items-center gap-3 shadow-inner">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {user.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-emerald-500 border-2 border-surface rounded-full shadow-sm animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Logged in as</p>
                <p className="text-xs font-semibold truncate text-foreground/90 mt-0.5">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest px-4 mb-3">Management</p>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm relative group",
                    isActive 
                      ? "text-primary font-semibold" 
                      : "text-secondary hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <link.icon size={18} className={cn(
                    "relative z-10 transition-transform duration-300",
                    isActive ? "text-primary" : "text-secondary group-hover:scale-110"
                  )} />
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 space-y-2 border-t border-secondary/10">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-primary transition-all duration-300 rounded-xl hover:bg-secondary/5 group"
            >
              <ExternalLink size={18} className="group-hover:scale-110 transition-transform" /> 
              <span className="group-hover:translate-x-1 transition-transform">View Website</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" /> 
              <span className="group-hover:translate-x-1 transition-transform">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
