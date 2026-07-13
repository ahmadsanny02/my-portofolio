'use client';

import { motion, Variants } from 'framer-motion';
import { useCertificates } from '@/hooks/useCertificates';
import { Award, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 16
    }
  }
};

export default function CertificatesSection() {
  const { certificates, loading } = useCertificates();

  return (
    <section id="certificates" className="py-24 bg-surface/30 dark:bg-slate-950/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">Achievements</h2>
          <h3 className="text-4xl font-bold">Certifications & Learning</h3>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-3xl border border-secondary/5 overflow-hidden shadow-sm">
                <div className="h-64 lg:h-80 bg-secondary/10 animate-pulse" />
                <div className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-20 bg-secondary/10 rounded animate-pulse" />
                      <div className="h-6 w-full bg-secondary/10 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-secondary/5 flex justify-between">
                    <div className="h-4 w-16 bg-secondary/10 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-secondary/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.015 }}
                className="bg-background rounded-[32px] border border-secondary/10 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/10 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
              >
                {cert.imageUrl && (
                  <div className="h-64 lg:h-80 overflow-hidden bg-secondary/5 relative">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      fill
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0 border border-primary/5">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-secondary text-sm font-semibold truncate">{cert.issuer}</p>
                      <h4 className="font-bold mb-1 leading-tight text-xl text-foreground line-clamp-2 h-12">{cert.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-secondary/5 dark:border-white/5">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      {formatDate(cert.issuedAt)}
                    </span>
                    {cert.credentialUrl && (
                      <motion.a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
                      >
                        Verify <ExternalLink size={12} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
