'use client';

import React, { useState } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { Plus, Trash2, ExternalLink, Award, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';
import CertificateForm from '@/components/admin/CertificateForm';
import { Certificate } from 'types';

export default function AdminCertificatesPage() {
  const { certificates, loading } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | undefined>(undefined);

  const filtered = certificates.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCert(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      toast.success('Certificate deleted');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (isFormOpen) {
    return (
      <CertificateForm 
        certificate={editingCert}
        onSuccess={() => {
          setIsFormOpen(false);
          window.location.reload();
        }}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certificates</h1>
          <p className="text-secondary text-sm sm:text-base">Manage your professional certifications.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Certificate
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-6 bg-surface rounded-3xl border border-secondary/5 flex items-start gap-4 animate-pulse">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-secondary/10 rounded" />
                <div className="h-3 w-2/3 bg-secondary/10 rounded" />
                <div className="flex gap-3 pt-2">
                  <div className="h-3 w-8 bg-secondary/10 rounded" />
                  <div className="h-3 w-8 bg-secondary/10 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.map((cert) => (
          <div key={cert.id} className="p-6 bg-surface rounded-3xl border border-secondary/5 flex items-start gap-4 group relative">
            <div className="bg-primary/10 p-3 rounded-xl text-primary"><Award size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
              <p className="text-secondary text-xs mb-2">{cert.issuer} • {formatDate(cert.issuedAt)}</p>
              <div className="flex gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <a href={cert.credentialUrl} target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  <ExternalLink size={12} />
                </a>
                <button onClick={() => handleEdit(cert)} className="text-xs font-bold text-primary hover:underline">
                  <Edit size={12} />
                </button>
                <button onClick={() => handleDelete(cert.id)} className="text-xs font-bold text-red-500 hover:underline">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
