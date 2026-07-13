import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';
import { UnauthorizedError } from '../../shared/errors/AppError';

// Extend Express Request to include user
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};
