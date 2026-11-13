import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../../shared/errors/AppError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // Express identifies error handlers by their 4-argument signature
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) console.error(`[Error] ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ success: false, message: err.message });
  }

  // Malformed JSON body from express.json()
  if ((err as { type?: string }).type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ success: false, message: 'Malformed JSON body' });
  }

  console.error('[Error]', err);

  // Fallback for non-operational errors: never leak internals in production
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  });
};
