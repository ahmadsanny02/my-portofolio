import { isAxiosError } from 'axios';

/** Extract the server's error message from an API failure, with a fallback. */
export function getApiError(err: unknown, fallback = 'Something went wrong'): string {
  if (isAxiosError(err)) {
    const message = (err.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (err.response?.status === 429) return 'Too many requests, please try again later.';
  }
  return fallback;
}
