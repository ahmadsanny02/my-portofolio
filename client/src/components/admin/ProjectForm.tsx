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
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Project Title</label>
            <input {...register('title')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. E-Commerce Platform" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Slug (URL)</label>
            <input {...register('slug')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. ecommerce-platform" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Tech Stack (comma separated)</label>
            <input {...register('techStack')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="Next.js, Tailwind, Supabase" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Demo URL</label>
              <input {...register('demoUrl')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Repo URL</label>
              <input {...register('repoUrl')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Thumbnail Image</label>
            <div className="border-2 border-dashed border-secondary/20 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden group">
              {thumbnailUrl ? (
                <>
                  <Image src={thumbnailUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" fill unoptimized />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors">
                      <Upload size={20} className="text-white" />
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                  </div>
                  <span className="text-sm font-medium text-secondary">Click to upload thumbnail</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Short Description</label>
            <textarea {...register('description')} rows={3} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none resize-none" />
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" {...register('isPublished')} className="w-5 h-5 accent-primary" />
              <label className="text-sm font-bold">Published</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 accent-primary" />
              <label className="text-sm font-bold">Featured</label>
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
