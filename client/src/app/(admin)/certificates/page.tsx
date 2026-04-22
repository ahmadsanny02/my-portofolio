'use client';

import React, { useState } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { Plus, Search, Trash2, ExternalLink, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdminCertificatesPage() {
  const { certificates, loading } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = certificates.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      toast.success('Certificate deleted');
      // In a real app, you'd trigger a re-fetch or update state
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certificates</h1>
          <p className="text-secondary">Manage your professional certifications.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
          <Plus size={20} /> Add Certificate
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 bg-secondary/10 rounded-3xl animate-pulse" />)
        ) : filtered.map((cert) => (
          <div key={cert.id} className="p-6 bg-surface rounded-3xl border border-secondary/5 flex items-start gap-4 group relative">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><Award size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
              <p className="text-secondary text-xs mb-2">{cert.issuer} • {formatDate(cert.issuedAt)}</p>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={cert.credentialUrl} target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  View <ExternalLink size={12} />
                </a>
                <button onClick={() => handleDelete(cert.id)} className="text-xs font-bold text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
