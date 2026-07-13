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
import { cn } from '@/lib/utils';

const certSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  issuer: z.string().min(2, 'Issuer too short'),
  issuedAt: z.string().min(1, 'Issued date is required'),
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-foreground">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Certificate Title</label>
              <input 
                {...register('title')} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                  errors.title 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="e.g. Meta Front-End Developer" 
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Issuer</label>
              <input 
                {...register('issuer')} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                  errors.issuer 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="e.g. Coursera" 
              />
              {errors.issuer && <p className="text-red-500 text-xs mt-1">{errors.issuer.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Issued Date</label>
                <input 
                  type="date" 
                  {...register('issuedAt')} 
                  className={cn(
                    "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all text-sm",
                    errors.issuedAt 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )} 
                />
                {errors.issuedAt && <p className="text-red-500 text-xs mt-1">{errors.issuedAt.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Category</label>
                <input 
                  {...register('category')} 
                  className={cn(
                    "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                    errors.category 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="Web Development" 
                />
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Credential URL</label>
              <input 
                {...register('credentialUrl')} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                  errors.credentialUrl 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="https://..." 
              />
              {errors.credentialUrl && <p className="text-red-500 text-xs mt-1">{errors.credentialUrl.message as string}</p>}
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-start">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Certificate Image / Badge</label>
              <div className="border-2 border-dashed border-secondary/20 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-background/20 dark:bg-slate-955/20 hover:bg-primary/[0.02] rounded-[24px] p-6 flex flex-col items-center justify-center h-[340px] relative overflow-hidden group transition-all duration-300">
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
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-secondary/10 pt-6">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-3 bg-secondary/10 hover:bg-secondary/15 text-foreground rounded-2xl font-bold transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            disabled={loading || uploading}
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Certificate</>}
          </button>
        </div>
      </form>
    </>
  );
}
