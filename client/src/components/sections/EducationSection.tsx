'use client';

import { motion } from 'framer-motion';
import { GraduationCap, MapPin } from 'lucide-react';
import { education } from '@/data/profile';

/**
 * Education timeline. Content comes from `data/profile.ts`; the section is
 * omitted entirely while that list is empty.
 */
export default function EducationSection() {
  if (education.length === 0) return null;

  return (
    <section id="education" className="overflow-hidden bg-surface/30 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-2.5 text-xs font-extrabold uppercase tracking-widest text-primary sm:text-sm">
            Education
          </h2>
          <h3 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">Academic Journey</h3>
        </div>

        <ol className="relative mx-auto max-w-3xl space-y-8 border-l border-secondary/20 pl-8">
          {education.map((entry, index) => (
            <motion.li
              key={`${entry.institution}-${entry.startYear}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 80, damping: 16, delay: index * 0.08 }}
              className="relative rounded-card border border-secondary/10 bg-background p-6 shadow-md sm:p-8"
            >
              <span
                className="absolute -left-[49px] top-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"
                aria-hidden="true"
              >
                <GraduationCap size={16} />
              </span>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                {entry.startYear} — {entry.endYear ?? 'Present'}
              </p>
              <h4 className="text-xl font-bold text-foreground">{entry.institution}</h4>
              <p className="mt-1 font-semibold text-secondary">
                {entry.degree}
                {entry.field ? ` · ${entry.field}` : ''}
              </p>
              {entry.location && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-secondary">
                  <MapPin size={14} aria-hidden="true" /> {entry.location}
                </p>
              )}
              {entry.description && (
                <p className="mt-4 text-sm leading-relaxed text-secondary">{entry.description}</p>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
