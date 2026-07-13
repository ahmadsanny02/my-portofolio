'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Download, Github, Instagram, Linkedin } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15
    }
  }
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Abstract Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1], 
          x: [0, 20, 0], 
          y: [0, -20, 0] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, -30, 0], 
          y: [0, 20, 0] 
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 -right-20 w-[450px] h-[450px] bg-accent/15 rounded-full blur-3xl" 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Greeting */}
            <motion.h2 
              variants={itemVariants} 
              className="text-primary font-extrabold tracking-widest mb-4 uppercase text-xs sm:text-sm"
            >
              Hello, I am
            </motion.h2>
            
            {/* Title / Name */}
            <motion.h1 
              variants={itemVariants} 
              className="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter text-foreground"
            >
              Ahmad <span className="text-primary bg-clip-text">Sani</span> Jabarulloh<span className="text-primary">.</span>
            </motion.h1>
            
            {/* Tagline */}
            <motion.p 
              variants={itemVariants} 
              className="text-secondary text-lg md:text-2xl mb-10 max-w-4xl leading-relaxed font-medium"
            >
              Frontend Developer specializing in{' '}
              <span className="text-foreground font-bold border-b border-primary/20">React.js</span>,{' '}
              <span className="text-foreground font-bold border-b border-primary/20">Next.js</span>, and{' '}
              <span className="text-foreground font-bold border-b border-primary/20">Node.js</span>. I transform
              complex ideas into elegant, high-performance web experiences.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 cursor-pointer"
              >
                Explore Projects <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="../CV/CV-Ahmad_Sani_Jabarulloh-Web_Developer.pdf"
                target="_blank"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-surface border border-secondary/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/5 transition-all shadow-sm cursor-pointer"
              >
                Download CV <Download size={20} />
              </motion.a>
            </motion.div>

            {/* Digital Footprint Linkage */}
            <motion.div variants={itemVariants} className="mt-20 flex items-center gap-6">
              <span className="text-secondary font-bold uppercase text-[10px] tracking-widest">
                Digital Footprint
              </span>
              <div className="h-px w-12 bg-secondary/30" />
              <div className="flex gap-4">
                {[
                  { href: "https://github.com/ahmadsanny2", Icon: Github },
                  { href: "https://linkedin.com/in/ahmadsanny02", Icon: Linkedin },
                  { href: "https://instagram.com/ahmadsanny02", Icon: Instagram },
                ].map(({ href, Icon }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-surface rounded-xl hover:text-primary transition-colors border border-secondary/10 hover:border-primary/30 shadow-sm flex items-center justify-center cursor-pointer"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
