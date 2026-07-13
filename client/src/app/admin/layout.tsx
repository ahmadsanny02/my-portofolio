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
  ExternalLink,
  Menu,
  X,
  ChevronsUpDown,
  Folder,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-surface/90 backdrop-blur-md border-b border-secondary/10 flex items-center justify-between px-6 sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/10">
            <Folder size={16} className="text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm leading-none text-foreground">Ahmad Sani Jabarulloh</span>
            <span className="text-[10px] text-secondary leading-none mt-0.5">Fullstack Developer</span>
          </div>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-secondary hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
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
        "w-64 bg-surface/85 dark:bg-surface/70 backdrop-blur-md border-r border-secondary/10 flex flex-col fixed h-full z-40 transition-all duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        isDesktopSidebarCollapsed && "lg:-translate-x-full"
      )}>
        <div className="p-4 flex flex-col h-full space-y-6">
          {/* Header Brand */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/5 cursor-pointer group transition-all duration-200">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/10">
              <Folder size={18} className="text-white" />
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="font-semibold text-sm text-foreground truncate group-hover:text-primary">Ahmad Sani Jabarulloh</span>
              <span className="text-[11px] text-secondary truncate">Fullstack Developer</span>
            </div>
            <ChevronsUpDown size={16} className="text-secondary group-hover:text-foreground shrink-0" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-4">
            <div>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest px-3 mb-2">Menu</p>
              <div className="space-y-1">
                {/* Dashboard Link */}
                <Link 
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/dashboard'
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-secondary hover:text-foreground hover:bg-secondary/5"
                  )}
                >
                  <LayoutDashboard size={18} className={cn("transition-transform group-hover:scale-105 shrink-0", pathname === '/admin/dashboard' ? "text-primary" : "text-secondary")} />
                  <span>Dashboard</span>
                </Link>

                {/* Projects Link */}
                <Link 
                  href="/admin/projects"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/projects'
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-secondary hover:text-foreground hover:bg-secondary/5"
                  )}
                >
                  <Briefcase size={18} className={cn("transition-transform group-hover:scale-105 shrink-0", pathname === '/admin/projects' ? "text-primary" : "text-secondary")} />
                  <span>Projects</span>
                </Link>

                {/* Certificates Link */}
                <Link 
                  href="/admin/certificates"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/certificates'
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-secondary hover:text-foreground hover:bg-secondary/5"
                  )}
                >
                  <Award size={18} className={cn("transition-transform group-hover:scale-105 shrink-0", pathname === '/admin/certificates' ? "text-primary" : "text-secondary")} />
                  <span>Certificates</span>
                </Link>

                {/* Skills Link */}
                <Link 
                  href="/admin/skills"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/skills'
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-secondary hover:text-foreground hover:bg-secondary/5"
                  )}
                >
                  <Settings size={18} className={cn("transition-transform group-hover:scale-105 shrink-0", pathname === '/admin/skills' ? "text-primary" : "text-secondary")} />
                  <span>Skills</span>
                </Link>

                {/* Messages Link */}
                <Link 
                  href="/admin/messages"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/messages'
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-secondary hover:text-foreground hover:bg-secondary/5"
                  )}
                >
                  <MessageSquare size={18} className={cn("transition-transform group-hover:scale-105 shrink-0", pathname === '/admin/messages' ? "text-primary" : "text-secondary")} />
                  <span>Messages</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* User Profile Card (Footer) */}
          <div className="relative border-t border-secondary/10 pt-4">
            <div 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/5 cursor-pointer group transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white text-sm shadow-md overflow-hidden shrink-0">
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="font-semibold text-sm text-foreground truncate group-hover:text-primary">
                  {user.email?.split('@')[0] || 'admin'}
                </span>
                <span className="text-[11px] text-secondary truncate">{user.email}</span>
              </div>
              <ChevronsUpDown size={16} className="text-secondary group-hover:text-foreground shrink-0" />
            </div>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                <div className="absolute bottom-14 left-0 right-0 bg-surface/95 dark:bg-surface/90 border border-secondary/15 rounded-xl p-1.5 shadow-2xl z-20 space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200 backdrop-blur-md">
                  <Link 
                    href="/" 
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-secondary hover:text-foreground hover:bg-secondary/5 rounded-lg transition-all"
                  >
                    <ExternalLink size={14} /> View Website
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-h-screen",
        isDesktopSidebarCollapsed ? "lg:ml-0" : "lg:ml-64"
      )}>
        {/* Toggle Trigger & Workspace Top Bar */}
        <div className="hidden lg:flex h-14 border-b border-secondary/10 px-6 items-center bg-surface/90 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="p-2 text-secondary hover:text-primary hover:bg-secondary/5 rounded-lg border border-secondary/10 hover:border-secondary/20 transition-all cursor-pointer flex items-center justify-center shadow-inner"
            title="Toggle Sidebar"
          >
            <PanelLeft size={16} />
          </button>
        </div>

        <main className="flex-1 p-6 lg:p-10 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
