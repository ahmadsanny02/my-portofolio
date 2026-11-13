import { z } from 'zod';

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(300).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
});

export const markReadSchema = z.object({
  isRead: z.boolean().default(true),
});
