'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary font-semibold tracking-wider mb-4">HELLO, I AM</h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Fullstack <span className="text-primary">Engineer</span> & <br />
              Digital <span className="text-accent">Architect</span>
            </h1>
            <p className="text-secondary text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              I build scalable web applications with modern technologies. 
              Focused on clean code, solid architecture, and exceptional user experiences.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all hover:gap-3 shadow-xl shadow-primary/30">
                View My Work <ArrowRight size={20} />
              </button>
              <button className="bg-surface border border-secondary/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/5 transition-all shadow-sm">
                Download CV <Download size={20} />
              </button>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <span className="text-secondary font-medium uppercase text-sm tracking-widest">Connect with me</span>
              <div className="h-px w-12 bg-secondary/30" />
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm">
                  <Github size={20} />
                </a>
                <a href="#" className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
