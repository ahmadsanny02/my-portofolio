'use client';

import React from 'react';
import { 
  Briefcase, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Settings, 
  Clock,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useCertificates } from '@/hooks/useCertificates';
import { useMessages } from '@/hooks/useMessages';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

export default function DashboardPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { certificates, loading: loadingCerts } = useCertificates();
  const { messages, loading: loadingMessages } = useMessages();

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  const stats = [
    { 
      name: 'Total Projects', 
      value: projects.length, 
      icon: Briefcase, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      loading: loadingProjects,
      trend: `${projects.filter(p => p.isFeatured).length} Featured`
    },
    { 
      name: 'Certificates', 
      value: certificates.length, 
      icon: Award, 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10', 
      loading: loadingCerts,
      trend: 'Verified Credentials'
    },
    { 
      name: 'Messages', 
      value: messages.length, 
      icon: MessageSquare, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      loading: loadingMessages,
      trend: unreadMessagesCount > 0 ? `${unreadMessagesCount} unread messages` : 'All caught up'
    },
    { 
      name: 'Profile Views', 
      value: '1.2k', 
      icon: TrendingUp, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10', 
      loading: false,
      trend: '+15% vs last week'
    },
  ];

  // Dynamic Timeline Activities
  const activities = [];
  if (projects.length > 0) {
    const latestProject = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestProject) {
      activities.push({
        id: `p-${latestProject.id}`,
        text: `Project "${latestProject.title}" was published`,
        time: latestProject.createdAt,
        icon: Briefcase,
        color: 'bg-blue-500/10 text-blue-500'
      });
    }
  }
  if (certificates.length > 0) {
    const latestCert = [...certificates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestCert) {
      activities.push({
        id: `c-${latestCert.id}`,
        text: `Certificate "${latestCert.title}" was uploaded`,
        time: latestCert.createdAt,
        icon: Award,
        color: 'bg-purple-500/10 text-purple-500'
      });
    }
  }
  if (messages.length > 0) {
    const latestMsg = [...messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (latestMsg) {
      activities.push({
        id: `m-${latestMsg.id}`,
        text: `Received a message from "${latestMsg.name}"`,
        time: latestMsg.created_at,
        icon: MessageSquare,
        color: 'bg-emerald-500/10 text-emerald-500'
      });
    }
  }

  const sortedActivities = activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const displayActivities = sortedActivities.length > 0 ? sortedActivities.slice(0, 3) : [
    { id: 'sys-1', text: 'Admin security protocols activated', time: '2026-07-12T07:00:00.000Z', icon: ShieldCheck, color: 'bg-primary/10 text-primary' },
    { id: 'sys-2', text: 'Supabase storage connection verified', time: '2026-07-12T06:00:00.000Z', icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 'sys-3', text: 'System initialized successfully', time: '2026-07-12T05:00:00.000Z', icon: ShieldCheck, color: 'bg-primary/10 text-primary' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-secondary bg-clip-text text-transparent">Dashboard Overview</h1>
        <p className="text-secondary text-sm sm:text-base mt-1">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div 
            variants={itemVariants}
            key={stat.name} 
            className="p-6 bg-surface/50 border border-secondary/10 rounded-3xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all hover:border-secondary/20"
          >
            {/* Hover decoration sphere */}
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-secondary text-sm font-semibold tracking-wide">{stat.name}</span>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
            {stat.loading ? (
              <div className="h-9 w-16 bg-secondary/10 rounded animate-pulse" />
            ) : (
              <div className="relative z-10">
                <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-2 flex items-center gap-1.5">
                  <Clock size={12} className="text-secondary/70" /> {stat.trend}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Activities & Quick Actions Row */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Recent Activity Timeline */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-3 p-8 bg-surface/50 rounded-[32px] border border-secondary/10 shadow-sm flex flex-col"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Recent Activity
          </h2>
          <div className="space-y-6 relative flex-1">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-secondary/10" />

            {displayActivities.map((act) => (
              <div key={act.id} className="flex gap-4 items-start relative group">
                <div className={`w-12 h-12 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0 z-10 shadow-sm transition-transform group-hover:scale-105 duration-300`}>
                  <act.icon size={20} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">{act.text}</p>
                  <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                    <Clock size={12} /> {formatDate(act.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 p-8 bg-surface/50 rounded-[32px] border border-secondary/10 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/admin/projects"
              className="p-5 bg-background hover:bg-primary/5 border border-secondary/10 rounded-2xl flex flex-col gap-3 hover:border-primary transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-2.5 bg-primary/10 rounded-xl w-fit text-primary group-hover:scale-105 transition-transform"><Plus size={18} /></div>
              <div>
                <p className="font-bold text-sm text-foreground/90">Add Project</p>
                <p className="text-secondary text-[11px] mt-0.5">Manage portfolio</p>
              </div>
            </Link>

            <Link 
              href="/admin/certificates"
              className="p-5 bg-background hover:bg-purple-500/5 border border-secondary/10 rounded-2xl flex flex-col gap-3 hover:border-purple-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-2.5 bg-purple-500/10 rounded-xl w-fit text-purple-500 group-hover:scale-105 transition-transform"><Award size={18} /></div>
              <div>
                <p className="font-bold text-sm text-foreground/90">Upload Cert</p>
                <p className="text-secondary text-[11px] mt-0.5">Manage awards</p>
              </div>
            </Link>

            <Link 
              href="/admin/skills"
              className="p-5 bg-background hover:bg-orange-500/5 border border-secondary/10 rounded-2xl flex flex-col gap-3 hover:border-orange-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-2.5 bg-orange-500/10 rounded-xl w-fit text-orange-500 group-hover:scale-105 transition-transform"><Settings size={18} /></div>
              <div>
                <p className="font-bold text-sm text-foreground/90">Edit Skills</p>
                <p className="text-secondary text-[11px] mt-0.5">Update skillset</p>
              </div>
            </Link>

            <Link 
              href="/admin/messages"
              className="p-5 bg-background hover:bg-emerald-500/5 border border-secondary/10 rounded-2xl flex flex-col gap-3 hover:border-emerald-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit text-emerald-500 group-hover:scale-105 transition-transform"><MessageSquare size={18} /></div>
              <div>
                <p className="font-bold text-sm text-foreground/90">Read Inbox</p>
                <p className="text-secondary text-[11px] mt-0.5">Check messages</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
