import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  description: z.string().optional(),
  long_description: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tech_stack: z.array(z.string()).default([]),
  demo_url: z.string().url().optional().or(z.literal('')),
  repo_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();
