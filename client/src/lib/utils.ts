import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ALLOWED_IMAGE_MIME_TYPES } from 'types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date/timestamp for display. Date-only strings (YYYY-MM-DD) are
 * parsed as UTC midnight, so formatting in UTC prevents an off-by-one-day
 * shift for visitors in negative-offset time zones.
 */
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** True when the file is one of the image types the upload API accepts. */
export function isAllowedImage(file: File) {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
}
