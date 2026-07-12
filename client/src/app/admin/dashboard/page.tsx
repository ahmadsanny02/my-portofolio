'use client';

import React from 'react';
import { Briefcase, Award, MessageSquare, TrendingUp } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useCertificates } from '@/hooks/useCertificates';
import { useMessages } from '@/hooks/useMessages';

export default function DashboardPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { certificates, loading: loadingCerts } = useCertificates();
  const { messages, loading: loadingMessages } = useMessages();

  const stats = [
    { name: 'Total Projects', value: projects.length, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', loading: loadingProjects },
    { name: 'Certificates', value: certificates.length, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', loading: loadingCerts },
    { name: 'Messages', value: messages.length, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', loading: loadingMessages },
    { name: 'Profile Views', value: '1.2k', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10', loading: false },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-secondary">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-surface rounded-3xl border border-secondary/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-secondary text-sm font-medium mb-1">{stat.name}</p>
            {stat.loading ? (
              <p className="text-3xl font-bold">0</p>
            ) : (
              <p className="text-3xl font-bold">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="p-8 bg-surface rounded-3xl border border-secondary/5 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New project &quot;AI SaaS Platform&quot; was added</p>
                  <p className="text-xs text-secondary">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-surface rounded-3xl border border-secondary/5 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-background border border-secondary/10 rounded-2xl text-sm font-bold hover:border-primary transition-all">
              Add New Project
            </button>
            <button className="p-4 bg-background border border-secondary/10 rounded-2xl text-sm font-bold hover:border-primary transition-all">
              Upload Certificate
            </button>
            <button className="p-4 bg-background border border-secondary/10 rounded-2xl text-sm font-bold hover:border-primary transition-all">
              Update Skills
            </button>
            <button className="p-4 bg-background border border-secondary/10 rounded-2xl text-sm font-bold hover:border-primary transition-all">
              View Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
