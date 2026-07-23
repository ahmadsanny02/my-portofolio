import { z } from 'zod';

export const createIssuerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export const updateIssuerSchema = createIssuerSchema.partial();
