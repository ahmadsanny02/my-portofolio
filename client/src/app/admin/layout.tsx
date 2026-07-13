'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  MessageSquare, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ChevronsUpDown,
  ChevronRight,
  ChevronDown,
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
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10">
            <Folder size={16} className="text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm leading-none text-zinc-200">Acme Inc</span>
            <span className="text-[10px] text-zinc-500 leading-none mt-0.5">Enterprise</span>
          </div>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-zinc-950 border-r border-zinc-900/80 flex flex-col fixed h-full z-40 transition-all duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        isDesktopSidebarCollapsed && "lg:-translate-x-full"
      )}>
        <div className="p-4 flex flex-col h-full space-y-6">
          {/* Header Brand */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/50 cursor-pointer group transition-all duration-200">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/10">
              <Folder size={18} className="text-white" />
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="font-semibold text-sm text-zinc-200 truncate group-hover:text-white">Acme Inc</span>
              <span className="text-[11px] text-zinc-500 truncate">Enterprise</span>
            </div>
            <ChevronsUpDown size={16} className="text-zinc-500 group-hover:text-zinc-300 shrink-0" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-4">
            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Platform</p>
              <div className="space-y-1">
                {/* Dashboard Link */}
                <Link 
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/dashboard'
                      ? "text-zinc-100 bg-zinc-900/60 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} className="text-zinc-400 group-hover:scale-105 transition-transform" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Collapsible Projects Section */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-all cursor-pointer group",
                      (pathname === '/admin/projects' || pathname === '/admin/certificates') && "text-zinc-100 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase size={18} className="text-zinc-400 group-hover:scale-105 transition-transform" />
                      <span>Projects</span>
                    </div>
                    {isProjectsExpanded ? (
                      <ChevronDown size={14} className="text-zinc-500" />
                    ) : (
                      <ChevronRight size={14} className="text-zinc-500" />
                    )}
                  </button>

                  {isProjectsExpanded && (
                    <div className="border-l border-zinc-800/80 ml-5 pl-4 py-1 space-y-1">
                      <Link 
                        href="/admin/projects"
                        className={cn(
                          "block py-1.5 px-2 text-xs rounded-md transition-all",
                          pathname === '/admin/projects' 
                            ? "text-zinc-100 font-semibold bg-zinc-900/40" 
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/20"
                        )}
                      >
                        All Projects
                      </Link>
                      <Link 
                        href="/admin/certificates"
                        className={cn(
                          "block py-1.5 px-2 text-xs rounded-md transition-all",
                          pathname === '/admin/certificates' 
                            ? "text-zinc-100 font-semibold bg-zinc-900/40" 
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/20"
                        )}
                      >
                        Certificates
                      </Link>
                    </div>
                  )}
                </div>

                {/* Skills Link */}
                <Link 
                  href="/admin/skills"
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/skills'
                      ? "text-zinc-100 bg-zinc-900/60 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} className="text-zinc-400 group-hover:scale-105 transition-transform" />
                    <span>Skills</span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Messages Link */}
                <Link 
                  href="/admin/messages"
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                    pathname === '/admin/messages'
                      ? "text-zinc-100 bg-zinc-900/60 font-medium"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-zinc-400 group-hover:scale-105 transition-transform" />
                    <span>Messages</span>
                  </div>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </nav>

          {/* User Profile Card (Footer) */}
          <div className="relative border-t border-zinc-900 pt-4">
            <div 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/50 cursor-pointer group transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-md overflow-hidden shrink-0">
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="font-semibold text-sm text-zinc-200 truncate group-hover:text-white">
                  {user.email?.split('@')[0] || 'admin'}
                </span>
                <span className="text-[11px] text-zinc-500 truncate">{user.email}</span>
              </div>
              <ChevronsUpDown size={16} className="text-zinc-500 group-hover:text-zinc-300 shrink-0" />
            </div>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                <div className="absolute bottom-14 left-0 right-0 bg-zinc-950 border border-zinc-900 rounded-xl p-1.5 shadow-2xl z-20 space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Link 
                    href="/" 
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-all"
                  >
                    <ExternalLink size={14} /> View Website
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
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
        <div className="h-14 border-b border-zinc-900/80 px-6 flex items-center bg-zinc-950/40 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 rounded-lg border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-center shadow-inner"
            title="Toggle Sidebar"
          >
            <PanelLeft size={16} />
          </button>
        </div>

        <main className="flex-1 p-6 lg:p-10 bg-zinc-950/20">
          {children}
        </main>
      </div>
    </div>
  );
}
