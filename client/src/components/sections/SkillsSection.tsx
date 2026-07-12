'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, Server, Cloud } from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend',
    icon: <Layout className="text-primary" />,
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Backend',
    icon: <Server className="text-primary" />,
    skills: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'MySQL', 'PostgreSQL'],
  },
  {
    title: 'Tools & DB',
    icon: <Database className="text-primary" />,
    skills: ['Supabase', 'Git', 'GitHub', 'Postman', 'Figma', 'Vercel'],
  },
  {
    title: 'Expertise',
    icon: <Cloud className="text-primary" />,
    skills: ['Cloud Computing', 'REST API', 'Agile', 'OpenAI API'],
  },
];

export default function SkillsSection() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="p-8 bg-surface rounded-3xl border border-secondary/5 hover:border-primary/20 transition-all group"
            >
              <div className="mb-6 p-4 bg-background w-fit rounded-2xl group-hover:rotate-12 transition-transform shadow-sm">
                {category.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{category.title}</h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-background text-secondary text-xs font-semibold rounded-lg border border-secondary/10">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
