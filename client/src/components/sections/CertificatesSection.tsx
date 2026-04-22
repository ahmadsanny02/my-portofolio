'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCertificates } from '@/hooks/useCertificates';
import { Award, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-background rounded-2xl border border-secondary/5 hover:border-primary/20 transition-all flex items-start gap-4 shadow-sm hover:shadow-lg group"
              >
                <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1 leading-tight">{cert.title}</h4>
                  <p className="text-secondary text-xs font-medium mb-3">{cert.issuer} • {formatDate(cert.issuedAt)}</p>
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Verify Credential <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
