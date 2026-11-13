import { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';
import {
  ForbiddenError,
  UnauthorizedError,
} from '../../shared/errors/AppError';

// Extend Express Request to include the authenticated Supabase user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Comma-separated list of e-mails allowed to use the admin API.
 * Fails closed: if ADMIN_EMAILS is empty, nobody is treated as admin.
 */
export function getAdminEmails(raw = process.env.ADMIN_EMAILS): string[] {
  return (raw || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(
  email: string | undefined,
  adminEmails: string[] = getAdminEmails(),
): boolean {
  return !!email && adminEmails.includes(email.toLowerCase());
}

if (getAdminEmails().length === 0) {
  console.warn(
    '[Auth] ADMIN_EMAILS is not set. All admin endpoints will return 403.',
  );
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    if (!isAdminEmail(data.user.email)) {
      throw new ForbiddenError('Admin access required');
    }

    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};
