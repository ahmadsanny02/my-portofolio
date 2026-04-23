'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import type { Project } from 'types';
import { formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <Tag size={12} /> Project
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  <Calendar size={12} /> {formatDate(project.createdAt)}
                </span>
              </div>
              <h1 className="text-5xl font-bold leading-tight">{project.title}</h1>
            </div>

            <p className="text-secondary text-xl leading-relaxed">
              {project.description}
            </p>

            <div className="prose prose-invert max-w-none text-secondary leading-loose">
              {project.longDescription || 'Detailed information about this project is coming soon.'}
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark shadow-xl shadow-primary/30">
                  Live Preview <ExternalLink size={20} />
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" className="bg-surface border border-secondary/10 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/5">
                  Source Code <Github size={20} />
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-32"
          >
            <div className="rounded-[40px] overflow-hidden shadow-2xl border border-secondary/10">
              <img 
                src={project.thumbnail || 'https://via.placeholder.com/1200x800'} 
                alt={project.title}
                className="w-full h-auto"
              />
            </div>
            
            <div className="mt-8 p-8 bg-surface rounded-3xl border border-secondary/5">
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-secondary">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-background border border-secondary/10 rounded-xl text-sm font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
