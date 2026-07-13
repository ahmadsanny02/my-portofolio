'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
};

const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

export default function AboutSection() {
  return (
    <section id="about" className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image & Stats Card Column */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="aspect-square bg-primary/10 rounded-[32px] overflow-hidden relative group border border-primary/10 shadow-lg"
            >
              <Image
                src="/profile/profile.png"
                alt="Ahmad Sani Jabarulloh"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            
            {/* Experience Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="absolute -bottom-6 -right-6 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-secondary/15 flex flex-col items-center justify-center min-w-[120px]"
            >
              <p className="text-4xl font-extrabold text-primary">2+</p>
              <p className="text-[10px] font-extrabold text-secondary uppercase tracking-widest text-center mt-1">
                Years Exp
              </p>
            </motion.div>
          </motion.div>

          {/* About Text Column */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 
              variants={textItemVariants}
              className="text-primary font-extrabold tracking-widest mb-2 uppercase text-xs sm:text-sm"
            >
              About Me
            </motion.h2>
            <motion.h3 
              variants={textItemVariants}
              className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-foreground"
            >
              Passionate Frontend Developer Based in West Bandung
            </motion.h3>
            <motion.p 
              variants={textItemVariants}
              className="text-secondary text-lg leading-relaxed mb-8 font-medium"
            >
              I am a dedicated Frontend Developer with a focus on the modern
              JavaScript ecosystem. With expertise in building responsive,
              interactive, and high-performance web applications using React.js
              and Next.js, I am passionate about learning new technologies and
              always strive to implement best practices in every project I
              undertake.
            </motion.p>
            
            {/* Details Grid */}
            <motion.div 
              variants={textItemVariants}
              className="grid grid-cols-2 gap-6 pt-4 border-t border-secondary/10"
            >
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Modern Stack</h4>
                <p className="text-secondary text-sm font-medium">Next.js & Tailwind CSS</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Location</h4>
                <p className="text-secondary text-sm font-medium">West Bandung, ID</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
