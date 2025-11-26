// app/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from 'lib/supabaseClient';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const flag = typeof window !== 'undefined'
                ? localStorage.getItem('dashboard-auth')
                : null;

            const { data } = await supabase.auth.getUser();

            if (!flag || !data.user) {
                router.replace('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('dashboard-auth');
        }
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60">
                <div className="px-6 py-5 border-b border-slate-800">
                    <h1 className="text-lg font-semibold tracking-tight">
                        Dashboard Portofolio
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Manage projects & certificates
                    </p>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
                    <button
                        onClick={() => router.push('/dashboard/projects')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${pathname.startsWith('/dashboard/projects')
                                ? 'bg-sky-500/20 text-sky-400'
                                : 'hover:bg-slate-800/60'
                            }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/certificates')}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${pathname.startsWith('/dashboard/certificates')
                                ? 'bg-sky-500/20 text-sky-400'
                                : 'hover:bg-slate-800/60'
                            }`}
                    >
                        Certificates
                    </button>
                </nav>
                <div className="px-4 py-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-xs font-medium"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col">
                {/* Top bar for mobile */}
                <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/70">
                    <span className="text-sm font-semibold">Dashboard</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push('/dashboard/projects')}
                            className="text-xs px-2 py-1 rounded bg-slate-800"
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/certificates')}
                            className="text-xs px-2 py-1 rounded bg-slate-800"
                        >
                            Certificates
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-xs px-2 py-1 rounded bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">{children}</div>
            </main>
        </div>
    );
}
