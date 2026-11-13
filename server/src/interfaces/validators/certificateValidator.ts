import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const createCertificateSchema = z.object({
  title: z.string().trim().min(3).max(200),
  issuer: z.string().trim().min(2).max(200),
  issuedAt: isoDate,
  expiredAt: isoDate.optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().trim().min(2).max(100),
});

export const updateCertificateSchema = createCertificateSchema.partial();
