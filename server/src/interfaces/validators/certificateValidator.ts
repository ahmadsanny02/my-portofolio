import { z } from 'zod';

export const createCertificateSchema = z.object({
  title: z.string().min(3).max(200),
  issuer: z.string().min(2).max(200),
  issuedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  expiredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional().or(z.literal('')),
  imageUrl: z.string().url(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(2).max(100),
});

export const updateCertificateSchema = createCertificateSchema.partial();
