'use client';

import { motion, Variants } from 'framer-motion';
import { Database, Layout, Server, Cloud } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend':
      return <Layout className="text-primary" size={22} />;
    case 'backend':
      return <Server className="text-primary" size={22} />;
    case 'devops':
    case 'mobile':
    case 'tools':
    case 'tools & db':
      return <Database className="text-primary" size={22} />;
    default:
      return <Cloud className="text-primary" size={22} />;
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
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

export default function SkillsSection() {
  const { skills, loading } = useSkills();

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Sort skills within categories by orderIndex then proficiency
  Object.keys(groupedSkills).forEach((cat) => {
    groupedSkills[cat].sort((a, b) => {
      if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
      return b.proficiency - a.proficiency;
    });
  });

  const categories = Object.keys(groupedSkills);

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">Skills</h2>
            <h3 className="text-4xl font-bold">Tech Stack & Expertise</h3>
          </div>
          <p className="text-secondary max-w-sm font-medium">
            My focus is on the modern JavaScript ecosystem and performance-driven web development.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-8 bg-surface rounded-3xl border border-secondary/5 animate-pulse min-h-[220px]" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-secondary py-12 bg-surface/30 rounded-3xl border border-secondary/5 w-full">
            No skills uploaded yet.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                variants={categoryVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-8 bg-surface/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-secondary/10 dark:border-white/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.02] transition-all duration-300 group"
              >
                <div className="mb-6 p-4 bg-background w-fit rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-sm border border-secondary/5">
                  {getCategoryIcon(category)}
                </div>
                <h4 className="text-xl font-bold mb-4 text-foreground">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <motion.span 
                      key={skill.id} 
                      whileHover={{ scale: 1.06, borderColor: "rgba(14, 165, 233, 0.3)", color: "var(--foreground)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="px-3 py-1 bg-background text-secondary text-xs font-semibold rounded-lg border border-secondary/10 hover:border-primary/30 transition-all cursor-default select-none"
                      title={`Proficiency: ${skill.proficiency}%`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
