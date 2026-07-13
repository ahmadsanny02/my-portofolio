'use client';

import React, { useState } from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { Plus, Trash2, ExternalLink, Award, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api-client';
import CertificateForm from '@/components/admin/CertificateForm';
import { Certificate } from 'types';
import TableControls from '@/components/admin/TableControls';
import { showToast, showConfirm } from '@/lib/sweetalert';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 280, damping: 22 } 
  }
};

export default function AdminCertificatesPage() {
  const { certificates, loading } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIssuer, setFilterIssuer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | undefined>(undefined);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilterIssuer(val);
    setCurrentPage(1);
  };

  const filteredCertificates = certificates.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterIssuer === '' ? true : c.issuer === filterIssuer;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage) || 1;
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const issuerOptions = Array.from(new Set(certificates.map(c => c.issuer)))
    .map(issuer => ({ value: issuer, label: issuer }));

  const handleAdd = () => {
    setEditingCert(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirm(
      'Are you sure?',
      'You are about to delete this certificate. This action cannot be undone.'
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/certificates/${id}`);
        showToast('success', 'Certificate deleted');
        window.location.reload();
      } catch {
        showToast('error', 'Failed to delete');
      }
    }
  };

  if (isFormOpen) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{editingCert ? 'Edit Certificate' : 'Add Certificate'}</h1>
          <p className="text-secondary text-sm sm:text-base">
            {editingCert ? `Editing details for "${editingCert.title}"` : 'Fill in the details to add a new professional certification.'}
          </p>
        </div>

        <div className="bg-surface/50 p-6 sm:p-10 rounded-3xl border border-secondary/10 dark:border-white/5 shadow-2xl backdrop-blur-md">
          <CertificateForm 
            certificate={editingCert}
            onSuccess={() => {
              setIsFormOpen(false);
              window.location.reload();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </div>
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

      <div className="bg-surface/50 p-6 rounded-3xl border border-secondary/10">
        <TableControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search certificates..."
          filterValue={filterIssuer}
          onFilterChange={handleFilterChange}
          filterOptions={issuerOptions}
          filterPlaceholder="All Issuers"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPagination={false}
        />
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
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full w-full"
          >
            {paginatedCertificates.map((cert) => (
              <motion.div 
                key={cert.id} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex flex-col bg-surface/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-secondary/10 dark:border-white/5 overflow-hidden group relative hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300 shadow-lg shadow-primary/[0.01]"
              >
                {/* Card Image Banner */}
                <div className="h-40 w-full bg-background border-b border-secondary/10 dark:border-white/5 relative overflow-hidden flex-shrink-0">
                  {cert.imageUrl ? (
                    <Image src={cert.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" fill unoptimized />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                      <Award size={40} className="animate-pulse" />
                    </div>
                  )}
                  
                  {/* Floating Category Badge */}
                  {cert.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/25 text-primary border border-primary/25 backdrop-blur-sm uppercase tracking-wider">
                        {cert.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2" title={cert.title}>
                      {cert.title}
                    </h4>
                    <p className="text-secondary text-sm font-semibold truncate">{cert.issuer}</p>
                    <p className="text-secondary/70 text-xs">Issued: {formatDate(cert.issuedAt)}</p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-secondary/10 dark:border-white/5">
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 py-2.5 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                    <button 
                      onClick={() => handleEdit(cert)} 
                      className="p-2.5 bg-secondary/10 hover:bg-secondary/20 hover:text-foreground text-secondary rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cert.id)} 
                      className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-8 px-2">
        <TableControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCertificates.length}
          itemsPerPage={itemsPerPage}
          showSearchAndFilter={false}
        />
      </div>
    </div>
  );
}
