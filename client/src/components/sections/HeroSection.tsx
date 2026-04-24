'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Instagram, Linkedin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h2 className="text-primary font-bold tracking-widest mb-4 uppercase text-sm">
              Hello, I am
            </h2>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tighter">
              Ahmad <span className='text-primary'>Sani</span> Jabarulloh<span className='text-primary'>.</span>
            </h1>
            <p className="text-secondary text-xl md:text-2xl mb-10 max-w-4xl leading-relaxed font-medium">
              Frontend Developer specializing in{' '}
              <span className="text-foreground">React.js</span>,{' '}
              <span className="text-foreground">Next.js</span>, and{' '}
              <span className="text-foreground">Node.js</span>. I transform
              complex ideas into elegant, high-performance web experiences.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all hover:gap-3 shadow-xl shadow-primary/30"
              >
                Explore Projects <ArrowRight size={20} />
              </a>
              <a
                href="../CV/CV-Ahmad_Sani_Jabarulloh-Frontend_Developer.pdf"
                target="_blank"
                className="bg-surface border border-secondary/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/5 transition-all shadow-sm"
              >
                Download CV <Download size={20} />
              </a>
            </div>

            <div className="mt-20 flex items-center gap-6">
              <span className="text-secondary font-bold uppercase text-xs tracking-widest">
                Digital Footprint
              </span>
              <div className="h-px w-12 bg-secondary/30" />
              <div className="flex gap-4">
                <a
                  href="https://github.com/ahmadsanny2"
                  target="_blank"
                  className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/ahmadsanny02"
                  target="_blank"
                  className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm"
                >
                  <Linkedin size={20} />
                </a>
                 <a
                  href="https://instagram.com/ahmadsanny02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
