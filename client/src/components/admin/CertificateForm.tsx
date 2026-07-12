'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, Save } from 'lucide-react';
import api from '@/lib/api-client';
import { showToast } from '@/lib/sweetalert';
import { Certificate } from 'types';
import Image from 'next/image';

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
      showToast('success', 'Image uploaded!');
    } catch {
      showToast('error', 'Upload failed. Ensure "certificates" bucket exists.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof certSchema>) => {
    setLoading(true);
    try {
      const payload = { ...data, imageUrl };
      if (certificate) {
        await api.put(`/certificates/${certificate.id}`, payload);
        showToast('success', 'Certificate updated!');
      } else {
        await api.post('/certificates', payload);
        showToast('success', 'Certificate created!');
      }
      onSuccess();
    } catch {
      showToast('error', 'Failed to save certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8 text-foreground">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Certificate Title</label>
            <input {...register('title')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="e.g. Meta Front-End Developer" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Issuer</label>
            <input {...register('issuer')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="e.g. Coursera" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Issued Date</label>
              <input type="date" {...register('issuedAt')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Category</label>
              <input {...register('category')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="Web Development" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Credential URL</label>
            <input {...register('credentialUrl')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-2 flex-1">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Certificate Image / Badge</label>
            <div className="border-2 border-dashed border-secondary/20 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-background/20 dark:bg-slate-950/20 hover:bg-primary/[0.02] rounded-[24px] p-6 flex flex-col items-center justify-center min-h-[180px] h-[calc(100%-2rem)] relative overflow-hidden group transition-all duration-300">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" alt="Certificate Preview" fill unoptimized />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <label className="cursor-pointer bg-primary p-3.5 rounded-2xl hover:bg-primary-dark transition-all hover:scale-110 shadow-lg shadow-primary/20 flex items-center justify-center">
                      <Upload size={20} className="text-white" />
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3 w-full text-center group/btn">
                  <div className="p-4 bg-primary/15 rounded-2xl text-primary transition-all group-hover/btn:scale-110 shadow-inner">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload size={22} />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground group-hover/btn:text-primary transition-colors block">Click to upload certificate image</span>
                    <span className="text-xs text-secondary mt-1 block">Supports PNG, JPG, WebP</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-4 bg-secondary/10 text-foreground rounded-xl font-bold hover:bg-secondary/15 transition-all cursor-pointer">
              Cancel
            </button>
            <button
              disabled={loading || uploading}
              type="submit"
              className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Certificate</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
