'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, Save, Trash, ChevronDown } from 'lucide-react';
import api from '@/lib/api-client';
import { showToast } from '@/lib/sweetalert';
import { Project } from 'types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const projectSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  description: z.string().min(10, 'Description too short'),
  longDescription: z.string().optional(),
  techStack: z.string().transform(val => val.split(',').map(s => s.trim())),
  demoUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
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
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail || '');
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      longDescription: project?.longDescription || '',
      techStack: project?.techStack?.join(', ') || '',
      demoUrl: project?.demoUrl || '',
      repoUrl: project?.repoUrl || '',
      category: project?.category || 'Web Application',
      status: project?.status || 'Completed',
      isPublished: project?.isPublished ?? true,
      isFeatured: project?.isFeatured ?? false,
      orderIndex: project?.orderIndex ?? 0,
    }
  });

  const categoryValue = watch('category');
  const statusValue = watch('status');

  const uploadThumbnailFile = async (file: File) => {
    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'portfolio');

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setThumbnailUrl(data.url);
      showToast('success', 'Thumbnail uploaded!');
    } catch {
      showToast('error', 'Upload failed');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const uploadGalleryFiles = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'portfolio');
        
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.url;
      });
      
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean) as string[];
      setImages(prev => [...prev, ...validUrls]);
      showToast('success', `${validUrls.length} gallery image(s) uploaded!`);
    } catch {
      showToast('error', 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadThumbnailFile(file);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadGalleryFiles(files);
    }
  };

  const handleThumbnailDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadThumbnailFile(file);
    } else {
      showToast('error', 'Please drop an image file');
    }
  };

  const handleGalleryDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadGalleryFiles(files);
    }
  };

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setLoading(true);
    try {
      const generatedSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = { ...data, slug: generatedSlug, thumbnail: thumbnailUrl, images };
      
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-foreground">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Project Title</label>
              <input 
                {...register('title')} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                  errors.title 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="e.g. E-Commerce Platform" 
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Tech Stack (comma separated)</label>
              <input 
                {...register('techStack')} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                  errors.techStack 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="Next.js, Tailwind, Supabase" 
              />
              {errors.techStack && <p className="text-red-500 text-xs mt-1">{errors.techStack.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Demo URL</label>
                <input 
                  {...register('demoUrl')} 
                  className={cn(
                    "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                    errors.demoUrl 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="https://..." 
                />
                {errors.demoUrl && <p className="text-red-500 text-xs mt-1">{errors.demoUrl.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Repo URL</label>
                <input 
                  {...register('repoUrl')} 
                  className={cn(
                    "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
                    errors.repoUrl 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="https://github.com/..." 
                />
                {errors.repoUrl && <p className="text-red-500 text-xs mt-1">{errors.repoUrl.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Category</label>
                <input type="hidden" {...register('category')} />
                
                {isCategoryOpen && (
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                )}

                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={cn(
                    "w-full flex items-center justify-between bg-background border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all text-sm cursor-pointer text-foreground/80 font-medium text-left relative z-20",
                    errors.category 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )}
                >
                  <span>{categoryValue || 'Select Category'}</span>
                  <ChevronDown size={16} className={cn("text-secondary transition-transform", isCategoryOpen && "rotate-180")} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-secondary/15 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 backdrop-blur-md max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {["Web Application", "Mobile Application", "UI/UX Design", "Desktop Application", "Machine Learning / AI"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setValue('category', cat, { shouldValidate: true });
                          setIsCategoryOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-4 py-2.5 text-xs text-left rounded-xl transition-all cursor-pointer font-semibold",
                          categoryValue === cat
                            ? "text-primary bg-primary/10 font-bold"
                            : "text-secondary hover:text-foreground hover:bg-secondary/5"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Status</label>
                <input type="hidden" {...register('status')} />

                {isStatusOpen && (
                  <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                )}

                <button
                  type="button"
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className={cn(
                    "w-full flex items-center justify-between bg-background border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all text-sm cursor-pointer text-foreground/80 font-medium text-left relative z-20",
                    errors.status 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                  )}
                >
                  <span>{statusValue || 'Select Status'}</span>
                  <ChevronDown size={16} className={cn("text-secondary transition-transform", isStatusOpen && "rotate-180")} />
                </button>

                {isStatusOpen && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-secondary/15 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 backdrop-blur-md max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {["Completed", "In Progress", "Maintenance"].map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => {
                          setValue('status', stat, { shouldValidate: true });
                          setIsStatusOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-4 py-2.5 text-xs text-left rounded-xl transition-all cursor-pointer font-semibold",
                          statusValue === stat
                            ? "text-primary bg-primary/10 font-bold"
                            : "text-secondary hover:text-foreground hover:bg-secondary/5"
                        )}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                )}
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Long Description (Detailed)</label>
              <textarea 
                {...register('longDescription')} 
                rows={4} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all resize-none text-sm",
                  errors.longDescription 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="Detailed description of the project, features, challenges..." 
              />
              {errors.longDescription && <p className="text-red-500 text-xs mt-1">{errors.longDescription.message as string}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Thumbnail Image</label>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingThumbnail(true); }}
                onDragLeave={() => setIsDraggingThumbnail(false)}
                onDrop={handleThumbnailDrop}
                className={cn(
                  "border-2 border-dashed rounded-[24px] p-6 flex flex-col items-center justify-center h-[200px] relative overflow-hidden group transition-all duration-300",
                  isDraggingThumbnail
                    ? "border-primary bg-primary/10"
                    : "border-secondary/20 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-background/20 dark:bg-slate-950/20 hover:bg-primary/[0.02]"
                )}
              >
                {thumbnailUrl ? (
                  <>
                    <Image src={thumbnailUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" fill unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <label className="cursor-pointer bg-primary p-3.5 rounded-2xl hover:bg-primary-dark transition-all hover:scale-110 shadow-lg shadow-primary/20 flex items-center justify-center">
                        <Upload size={20} className="text-white" />
                        <input type="file" className="hidden" onChange={handleThumbnailUpload} accept="image/*" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3 w-full text-center group/btn">
                    <div className="p-4 bg-primary/15 rounded-2xl text-primary transition-all group-hover/btn:scale-110 shadow-inner">
                      {uploadingThumbnail ? <Loader2 className="animate-spin" /> : <Upload size={22} />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-foreground group-hover/btn:text-primary transition-colors block">Click or drop thumbnail here</span>
                      <span className="text-xs text-secondary mt-1 block">Supports PNG, JPG, WebP</span>
                    </div>
                    <input type="file" className="hidden" onChange={handleThumbnailUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Short Description</label>
              <textarea 
                {...register('description')} 
                rows={3} 
                className={cn(
                  "w-full bg-background/50 dark:bg-slate-900/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all resize-none text-sm",
                  errors.description 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="Briefly describe the project..." 
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Project Gallery (Multiple Screenshots)</label>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingGallery(true); }}
                onDragLeave={() => setIsDraggingGallery(false)}
                onDrop={handleGalleryDrop}
                className={cn(
                  "border-2 border-dashed rounded-[24px] p-6 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group transition-all duration-300",
                  isDraggingGallery
                    ? "border-primary bg-primary/10"
                    : "border-secondary/20 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 bg-background/20 dark:bg-slate-950/20 hover:bg-primary/[0.02]"
                )}
              >
                <label className="cursor-pointer flex flex-col items-center gap-2 w-full text-center group/btn">
                  <div className="p-3 bg-primary/15 rounded-xl text-primary transition-all group-hover/btn:scale-105 shadow-inner">
                    {uploadingGallery ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground group-hover/btn:text-primary transition-colors block">Click or drop multiple images here</span>
                    <span className="text-xs text-secondary mt-1 block">Supports PNG, JPG, WebP</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleGalleryUpload} accept="image/*" multiple />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4 max-h-[180px] overflow-y-auto p-1 border border-secondary/5 rounded-2xl bg-secondary/[0.01]">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-secondary/15 h-16 group">
                      <Image src={img} alt={`Gallery Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                      <button 
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer shadow-md"
                      >
                        <Trash size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
            disabled={loading || uploadingThumbnail || uploadingGallery}
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> {project ? 'Save' : 'Create'} Project</>}
          </button>
        </div>
      </form>
    </>
  );
}
