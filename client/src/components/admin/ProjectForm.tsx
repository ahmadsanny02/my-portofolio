'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, Save } from 'lucide-react';
import api from '@/lib/api-client';
import { showToast } from '@/lib/sweetalert';
import { Project } from 'types';
import Image from 'next/image';

const projectSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  slug: z.string().min(3, 'Slug too short'),
  description: z.string().min(10, 'Description too short'),
  longDescription: z.string().optional(),
  techStack: z.string().transform(val => val.split(',').map(s => s.trim())),
  demoUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().default(0),
});

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail || '');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      description: project?.description || '',
      longDescription: project?.longDescription || '',
      techStack: project?.techStack?.join(', ') || '',
      demoUrl: project?.demoUrl || '',
      repoUrl: project?.repoUrl || '',
      isPublished: project?.isPublished ?? true,
      isFeatured: project?.isFeatured ?? false,
      orderIndex: project?.orderIndex ?? 0,
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'portfolio');

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setThumbnailUrl(data.url);
      showToast('success', 'Image uploaded!');
    } catch {
      showToast('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setLoading(true);
    try {
      const payload = { ...data, thumbnail: thumbnailUrl };
      if (project) {
        await api.put(`/projects/${project.id}`, payload);
        showToast('success', 'Project updated!');
      } else {
        await api.post('/projects', payload);
        showToast('success', 'Project created!');
      }
      onSuccess();
    } catch {
      showToast('error', 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8 text-foreground">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Project Title</label>
            <input {...register('title')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="e.g. E-Commerce Platform" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Slug (URL)</label>
            <input {...register('slug')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="e.g. ecommerce-platform" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Tech Stack (comma separated)</label>
            <input {...register('techStack')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="Next.js, Tailwind, Supabase" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Demo URL</label>
              <input {...register('demoUrl')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Repo URL</label>
              <input {...register('repoUrl')} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/30 text-sm" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Thumbnail Image</label>
            <div className="border-2 border-dashed border-secondary/20 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-background/20 dark:bg-slate-950/20 hover:bg-primary/[0.02] rounded-[24px] p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden group transition-all duration-300">
              {thumbnailUrl ? (
                <>
                  <Image src={thumbnailUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" fill unoptimized />
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
                    <span className="text-sm font-semibold text-foreground group-hover/btn:text-primary transition-colors block">Click to upload thumbnail</span>
                    <span className="text-xs text-secondary mt-1 block">Supports PNG, JPG, WebP</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary">Short Description</label>
            <textarea {...register('description')} rows={3} className="w-full bg-background/50 dark:bg-slate-950/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-sm" placeholder="Briefly describe the project..." />
          </div>

          <div className="flex flex-wrap gap-6 py-2 bg-secondary/5 dark:bg-white/[0.02] rounded-2xl px-4 border border-secondary/10 dark:border-white/5">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id="isPublished" {...register('isPublished')} className="w-4 h-4 accent-primary rounded cursor-pointer" />
              <label htmlFor="isPublished" className="text-sm font-semibold text-secondary select-none cursor-pointer">Published</label>
            </div>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id="isFeatured" {...register('isFeatured')} className="w-4 h-4 accent-primary rounded cursor-pointer" />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-secondary select-none cursor-pointer">Featured</label>
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
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {project ? 'Save' : 'Create'} Project</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
