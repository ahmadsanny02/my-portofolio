import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  thumbnail: z.string().url().optional(),
  techStack: z.array(z.string()).default([]),
  demoUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
  images: z.array(z.string().url()).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();
