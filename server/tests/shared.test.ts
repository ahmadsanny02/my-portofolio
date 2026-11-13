import { describe, it, expect, vi } from 'vitest';

// Repositories import the Supabase client at module load; stub it out.
vi.mock('../src/infrastructure/database/supabase/SupabaseClient', () => ({ supabase: {} }));

import { mapDbError } from '../src/shared/errors/mapDbError';
import { detectImageType } from '../src/shared/utils/detectImageType';
import { certificateToDb } from '../src/infrastructure/database/supabase/CertificateSupabaseRepository';
import { slugify } from '../src/infrastructure/database/supabase/ProjectSupabaseRepository';
import { isAdminEmail, getAdminEmails } from '../src/interfaces/middlewares/authMiddleware';
import { rateLimit } from '../src/interfaces/middlewares/rateLimit';
import type { Request, Response } from 'express';

describe('mapDbError', () => {
  it.each([
    ['PGRST116', 404],
    ['22P02', 400],
    ['23505', 409],
    ['XX000', 500],
  ])('maps %s to HTTP %i', (code, status) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(mapDbError({ code, message: 'm' }).statusCode).toBe(status);
  });

  it('never leaks the raw database message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(mapDbError({ code: 'XX000', message: 'secret internals' }).message).toBe('Database error');
  });
});

describe('detectImageType', () => {
  it('detects PNG, JPEG and WebP by magic bytes', () => {
    expect(detectImageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))).toBe('image/png');
    expect(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(detectImageType(Buffer.from('RIFF\0\0\0\0WEBPVP8 ', 'binary'))).toBe('image/webp');
  });

  it('rejects SVG / HTML disguised as an image', () => {
    expect(detectImageType(Buffer.from('<svg onload="alert(1)"></svg>'))).toBeNull();
  });
});

describe('certificateToDb', () => {
  it('omits fields that were not sent (partial update keeps issued_at)', () => {
    expect(certificateToDb({ title: 'X' })).toEqual({ title: 'X' });
  });

  it('clears optional columns when sent as empty string', () => {
    expect(certificateToDb({ credentialUrl: '', expiredAt: '' })).toEqual({
      credential_url: null,
      expired_at: null,
    });
  });
});

describe('slugify', () => {
  it('produces kebab-case', () => {
    expect(slugify('  My Cool Project! v2 ')).toBe('my-cool-project-v2');
  });
});

describe('admin allowlist', () => {
  it('parses and matches case-insensitively', () => {
    const list = getAdminEmails(' Admin@Site.com , other@site.com ');
    expect(isAdminEmail('admin@site.com', list)).toBe(true);
    expect(isAdminEmail('random@user.com', list)).toBe(false);
  });

  it('fails closed when not configured', () => {
    expect(isAdminEmail('admin@site.com', getAdminEmails(''))).toBe(false);
  });
});

describe('rateLimit', () => {
  it('blocks after the limit and resets after the window', () => {
    let now = 0;
    const limiter = rateLimit({ windowMs: 1000, limit: 2, now: () => now });
    const req = { ip: '1.2.3.4', socket: {} } as unknown as Request;
    const res = { setHeader: vi.fn() } as unknown as Response;
    const results: unknown[] = [];
    const next = (err?: unknown) => results.push(err);

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);
    expect(results[0]).toBeUndefined();
    expect(results[1]).toBeUndefined();
    expect((results[2] as { statusCode: number }).statusCode).toBe(429);

    now = 1001;
    limiter(req, res, next);
    expect(results[3]).toBeUndefined();
  });
});
