import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from './AppError';

interface DbErrorLike {
  code?: string;
  message: string;
}

/**
 * Translate a Supabase/PostgREST error into an operational AppError so the
 * client gets a meaningful status code instead of a generic 500, and raw
 * database messages are never leaked.
 */
export function mapDbError(error: DbErrorLike): AppError {
  switch (error.code) {
    case 'PGRST116': // .single() matched zero rows
      return new NotFoundError();
    case '22P02': // invalid_text_representation (e.g. malformed UUID)
      return new BadRequestError('Invalid identifier');
    case '23505': // unique_violation
      return new ConflictError('Resource already exists');
    case '23502': // not_null_violation
    case '23514': // check_violation
      return new BadRequestError('Invalid data');
    default:
      console.error(`[DB] ${error.code ?? 'unknown'}: ${error.message}`);
      return new AppError('Database error', 500);
  }
}
