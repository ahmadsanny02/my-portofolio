import { z } from 'zod';

export const createContactMessageSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  subject: z.string().max(300).optional().or(z.literal('')),
  message: z.string().min(10),
});
