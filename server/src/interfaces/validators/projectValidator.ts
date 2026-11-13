import { z } from 'zod';

const optionalUrl = z.string().url().optional().or(z.literal(''));

export const slugSchema = z
  .string()
  .min(3)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case');

export const createProjectSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: slugSchema.optional(),
  description: z.string().max(1000).optional(),
  longDescription: z.string().max(20000).optional(),
  thumbnail: optionalUrl,
  techStack: z
    .array(z.string().trim().min(1).max(50))
    .max(30)
    .default([]),
  demoUrl: optionalUrl,
  repoUrl: optionalUrl,
  category: z.string().trim().min(1).max(100).optional(),
  status: z.string().trim().min(1).max(50).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
  images: z.array(z.string().url()).max(30).default([]),
});

// Partial updates must not re-apply defaults (would reset untouched fields)
export const updateProjectSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  slug: slugSchema.optional(),
  description: z.string().max(1000).optional(),
  longDescription: z.string().max(20000).optional(),
  thumbnail: optionalUrl,
  techStack: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  demoUrl: optionalUrl,
  repoUrl: optionalUrl,
  category: z.string().trim().min(1).max(100).optional(),
  status: z.string().trim().min(1).max(50).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
  images: z.array(z.string().url()).max(30).optional(),
});
