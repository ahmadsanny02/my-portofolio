'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsSection() {
  const { projects, loading } = useProjects();
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleProjects = projects.slice(0, visibleCount);

  return (
    <section id="projects" className="py-24 bg-surface/30 dark:bg-slate-955/30 overflow-hidden">
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
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 16,
                  delay: (index % 10) * 0.05
                }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group relative bg-background rounded-[32px] overflow-hidden border border-secondary/10 dark:border-white/5 shadow-md hover:shadow-2xl hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Container with Zoom effect */}
                <Link href={`/projects/${project.slug}`} className="h-64 lg:h-80 overflow-hidden bg-secondary/5 relative block">
                  <Image
                    src={
                      project.thumbnail || 'https://via.placeholder.com/600x400'
                    }
                    alt={project.title}
                    fill
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-extrabold uppercase tracking-wider bg-secondary/10 dark:bg-white/5 text-secondary px-2.5 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-foreground">
                    <Link href={`/projects/${project.slug}`} className="hover:text-primary transition-colors duration-200">
                      {project.title}
                    </Link>
                  </h4>
                  <p className="text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                      >
                        Live Demo <ExternalLink size={14} />
                      </motion.a>
                    )}
                    {project.repoUrl && (
                      <motion.a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-foreground transition-colors cursor-pointer"
                      >
                        Source <Github size={14} />
                      </motion.a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-1 text-sm font-bold hover:text-primary transition-colors ml-auto group/details"
                    >
                      Details <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && projects.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-8 py-3.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-primary/20 hover:border-primary"
            >
              Show More
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
