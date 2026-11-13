import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(100),
  iconUrl: z.string().url().optional().or(z.literal('')),
  proficiency: z.number().int().min(1).max(100),
  orderIndex: z.number().int().default(0),
});

export const updateSkillSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  category: z.string().trim().min(2).max(100).optional(),
  iconUrl: z.string().url().optional().or(z.literal('')),
  proficiency: z.number().int().min(1).max(100).optional(),
  orderIndex: z.number().int().optional(),
});
