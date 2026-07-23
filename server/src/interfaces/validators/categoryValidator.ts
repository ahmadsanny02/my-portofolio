import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  type: z.enum(['project', 'certificate', 'skill', 'general']),
});

export const updateCategorySchema = createCategorySchema.partial();
