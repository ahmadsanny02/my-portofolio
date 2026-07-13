'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, Server, Cloud } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend':
      return <Layout className="text-primary" />;
    case 'backend':
      return <Server className="text-primary" />;
    case 'devops':
    case 'mobile':
    case 'tools':
    case 'tools & db':
      return <Database className="text-primary" />;
    default:
      return <Cloud className="text-primary" />;
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
    <section id="skills" className="py-24">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="p-8 bg-surface rounded-3xl border border-secondary/5 hover:border-primary/20 transition-all group"
              >
                <div className="mb-6 p-4 bg-background w-fit rounded-2xl group-hover:rotate-12 transition-transform shadow-sm">
                  {getCategoryIcon(category)}
                </div>
                <h4 className="text-xl font-bold mb-4">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <span 
                      key={skill.id} 
                      className="px-3 py-1 bg-background text-secondary text-xs font-semibold rounded-lg border border-secondary/10 hover:border-primary/30 transition-all"
                      title={`Proficiency: ${skill.proficiency}%`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
