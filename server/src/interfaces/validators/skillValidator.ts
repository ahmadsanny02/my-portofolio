import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(100),
  iconUrl: z.string().url().optional().or(z.literal('')),
  proficiency: z.number().int().min(1).max(100),
  orderIndex: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();
