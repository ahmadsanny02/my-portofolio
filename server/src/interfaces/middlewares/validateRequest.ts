import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '../../shared/errors/AppError';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return next(new BadRequestError(message));
      }
      next(error);
    }
  };
};
