'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Tag, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2 
} from 'lucide-react';
import type { Project } from 'types';
import { formatDate } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Combine thumbnail and gallery images for the interactive lightbox
  const allImages = [
    project.thumbnail,
    ...(project.images || [])
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : null));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : null));
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore body scroll on cleanup
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, allImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Decorative Background Glows Wrapper (Prevents horizontal overflow while allowing sticky children) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Header Area with Blurred Background */}
      <div className="relative pt-32 pb-20 border-b border-secondary/10 overflow-hidden">
        {project.thumbnail && (
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-20 scale-105 pointer-events-none">
            <Image 
              src={project.thumbnail} 
              alt="" 
              fill 
              className="object-cover blur-2xl" 
              unoptimized 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          {/* Back Button */}
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-all mb-8 group font-bold text-sm cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
          </motion.button>

          {/* Badges & Title */}
          <div className="max-w-4xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                <Tag size={12} /> Project
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-secondary bg-secondary/10 border border-secondary/15 px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                <Calendar size={12} /> {formatDate(project.createdAt)}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-foreground"
            >
              {project.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-secondary text-lg sm:text-xl font-medium leading-relaxed max-w-3xl"
            >
              {project.description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: Project Case Study (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Main Overview & Metrics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-secondary/10 dark:border-white/5 p-8 sm:p-10 shadow-lg space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Project Overview
                </h3>
                <div className="prose prose-lg dark:prose-invert max-w-none text-secondary leading-relaxed font-medium mb-6">
                  {project.longDescription || 'Detailed information about this project is coming soon.'}
                </div>
              </div>

              {/* Large Project Image Centerpiece */}
              {project.thumbnail && (
                <div 
                  onClick={() => setLightboxIndex(0)}
                  className="rounded-2xl overflow-hidden border border-secondary/10 dark:border-white/5 relative aspect-[16/9] w-full cursor-pointer group shadow-md hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300"
                >
                  <Image 
                    src={project.thumbnail} 
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20">
                      <Maximize2 size={22} />
                    </div>
                  </div>
                </div>
              )}

              {/* Project Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-secondary/10 dark:border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold">Category</span>
                  <p className="text-sm font-bold text-foreground">{project.category || 'Web Application'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold">Released</span>
                  <p className="text-sm font-bold text-foreground">{formatDate(project.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold">Status</span>
                  <p className="text-sm font-bold text-foreground">{project.status || 'Completed'}</p>
                </div>
              </div>

              {/* Technologies Used inline */}
              <div className="space-y-3 pt-6 border-t border-secondary/10 dark:border-white/5">
                <h4 className="font-extrabold uppercase text-[10px] tracking-widest text-secondary flex items-center gap-2">
                  <Cpu size={14} className="text-primary" /> Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <motion.span 
                      key={tech} 
                      whileHover={{ scale: 1.05, borderColor: "rgba(14, 165, 233, 0.3)" }}
                      className="px-3.5 py-2 bg-background border border-secondary/10 dark:border-white/5 rounded-xl text-xs font-bold text-secondary cursor-default select-none transition-all"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons inline */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-secondary/10 dark:border-white/5">
                {project.demoUrl && (
                  <motion.a 
                    href={project.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer text-sm"
                  >
                    Live Preview <ExternalLink size={16} />
                  </motion.a>
                )}
                {project.repoUrl && (
                  <motion.a 
                    href={project.repoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-surface dark:bg-slate-800/40 border border-secondary/20 dark:border-white/10 hover:bg-secondary/5 text-foreground px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer text-sm"
                  >
                    Source Code <Github size={16} />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Gallery Sidebar (1 Column wide) */}
          <div className="space-y-8 lg:sticky lg:top-32">
            {allImages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-surface/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-secondary/10 dark:border-white/5 p-8 shadow-lg space-y-6"
              >
                <h3 className="text-xl font-bold text-foreground border-b border-secondary/10 dark:border-white/5 pb-3">
                  Project Gallery
                </h3>
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto h-auto lg:h-[700px] pr-1.5 snap-x lg:snap-y snap-mandatory scroll-smooth gap-6 custom-scrollbar pb-3 lg:pb-0">
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setLightboxIndex(idx)}
                      className={`${allImages.length > 1 ? 'w-[85%] sm:w-[60%] lg:w-full' : 'w-full'} rounded-2xl overflow-hidden border border-secondary/10 dark:border-white/5 relative block aspect-[3/2] cursor-pointer group shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300 snap-start snap-always shrink-0`}
                    >
                      <Image 
                        src={img} 
                        alt={`Project preview ${idx + 1}`} 
                        fill 
                        className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out" 
                        unoptimized 
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Photo Lightbox Overlay Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 select-none"
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 cursor-pointer shadow-lg z-50"
              title="Close"
            >
              <X size={20} />
            </button>

            {/* Lightbox Main Content Container */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-6xl w-full aspect-[16/10] max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-zinc-950/40"
            >
              <Image 
                src={allImages[lightboxIndex]} 
                alt="" 
                fill 
                className="object-contain p-2" 
                unoptimized 
              />
              
              {/* Pagination Info Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 tracking-widest select-none">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Navigation Controls */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-6 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/5 cursor-pointer shadow-lg"
                  title="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/5 cursor-pointer shadow-lg"
                  title="Next Image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
