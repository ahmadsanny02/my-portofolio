'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCertificates } from '@/hooks/useCertificates';
import { Award, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export default function CertificatesSection() {
  const { certificates, loading } = useCertificates();

  return (
    <section id="certificates" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">Achievements</h2>
          <h3 className="text-4xl font-bold">Certifications & Learning</h3>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-secondary/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1}}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-3xl border border-secondary/5 hover:border-primary/20 transition-all overflow-hidden shadow-sm hover:shadow-xl group"
              >
                {cert.imageUrl && (
                  <div className="h-64 lg:h-80 overflow-hidden bg-secondary/5 relative">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary flex-shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-secondary text-sm font-medium">{cert.issuer}</p>
                      <h4 className="font-bold mb-1 leading-tight text-xl line-clamp-2 h-12">{cert.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-secondary/5">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      {formatDate(cert.issuedAt)}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Verify <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
