'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

export default function ProjectsSection() {
  const { projects, loading } = useProjects();

  return (
    <section id="projects" className="py-24 bg-surface/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">
            Portfolio
          </h2>
          <h3 className="text-4xl font-bold">Featured Projects</h3>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface rounded-3xl border border-secondary/5 overflow-hidden shadow-sm"
              >
                <div className="h-64 lg:h-80 bg-secondary/10 animate-pulse" />
                <div className="p-8">
                  <div className="flex gap-2 mb-4">
                    <div className="h-4 w-12 bg-secondary/10 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-secondary/10 rounded animate-pulse" />
                  </div>
                  <div className="h-7 w-3/4 bg-secondary/10 rounded-lg animate-pulse mb-3" />
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-secondary/10 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-secondary/10 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 w-20 bg-secondary/10 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-secondary/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-secondary/5"
              >
                <div className="h-64 lg:h-80 overflow-hidden bg-secondary/5 relative">
                  <Image
                    src={
                      project.thumbnail || 'https://via.placeholder.com/600x400'
                    }
                    alt={project.title}
                    fill
                    className="object-fill h-full w-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-bold uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                  <p className="text-secondary text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2 transition-all"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-bold hover:text-primary transition-colors"
                      >
                        Source <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
