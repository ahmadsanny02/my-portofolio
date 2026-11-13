import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../../shared/errors/AppError';

const uuidSchema = z.string().uuid();

/** Reject non-UUID `:id` params with 400 before they reach the database. */
export const validateId = (req: Request, _res: Response, next: NextFunction) => {
  if (!uuidSchema.safeParse(req.params.id).success) {
    return next(new BadRequestError('Invalid id'));
  }
  next();
};
