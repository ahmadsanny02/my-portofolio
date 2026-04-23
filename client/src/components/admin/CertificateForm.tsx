'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2, Save } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Certificate } from 'types';

const certSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  issuer: z.string().min(2, 'Issuer too short'),
  issuedAt: z.string(),
  expiredAt: z.string().optional(),
  category: z.string().min(2, 'Category too short'),
  credentialUrl: z.string().url().optional().or(z.literal('')),
});

interface CertificateFormProps {
  certificate?: Certificate;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CertificateForm({ certificate, onSuccess, onCancel }: CertificateFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(certificate?.imageUrl || '');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(certSchema),
    defaultValues: {
      title: certificate?.title || '',
      issuer: certificate?.issuer || '',
      issuedAt: certificate?.issuedAt ? new Date(certificate.issuedAt).toISOString().split('T')[0] : '',
      expiredAt: certificate?.expiredAt ? new Date(certificate.expiredAt).toISOString().split('T')[0] : '',
      category: certificate?.category || '',
      credentialUrl: certificate?.credentialUrl || '',
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'certificates');

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUrl(data.url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = { ...data, imageUrl };
      if (certificate) {
        await api.put(`/certificates/${certificate.id}`, payload);
        toast.success('Certificate updated!');
      } else {
        await api.post('/certificates', payload);
        toast.success('Certificate created!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-8 rounded-3xl border border-secondary/5 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{certificate ? 'Edit Certificate' : 'New Certificate'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-secondary/10 rounded-full"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Certificate Title</label>
            <input {...register('title')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Issuer</label>
            <input {...register('issuer')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Issued Date</label>
            <input type="date" {...register('issuedAt')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Category</label>
            <input {...register('category')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="Web Development" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Credential URL</label>
          <input {...register('credentialUrl')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="https://..." />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            disabled={loading || uploading}
            type="submit"
            className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Certificate</>}
          </button>
          <button type="button" onClick={onCancel} className="px-8 py-4 bg-background border border-secondary/10 rounded-xl font-bold hover:bg-secondary/5 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
