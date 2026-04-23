'use client';

import React, { useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (pathname === '/admin/login') return <>{children}</>;

  if (!user) return null; // Prevent rendering dashboard if not authenticated

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-secondary/10 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <User size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin<span className="text-primary">Panel</span></span>
          </Link>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-secondary hover:bg-secondary/5 hover:text-foreground"
                  )}
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-sm text-secondary hover:text-primary transition-colors"
          >
            <ExternalLink size={18} /> View Website
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}
