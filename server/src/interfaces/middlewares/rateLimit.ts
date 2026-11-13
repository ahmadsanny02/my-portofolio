import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsError } from '../../shared/errors/AppError';

interface RateLimitOptions {
  windowMs: number;
  limit: number;
  /** Injected for tests. */
  now?: () => number;
}

/**
 * Minimal fixed-window, in-memory rate limiter keyed by client IP.
 *
 * NOTE: on serverless platforms (Vercel) each instance keeps its own memory,
 * so this is a best-effort guard. For strict limits use a shared store
 * (e.g. Upstash Redis) or the platform firewall.
 */
export function rateLimit({ windowMs, limit, now = Date.now }: RateLimitOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = now();

    // Opportunistic cleanup so the map cannot grow without bound
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.resetAt <= current) hits.delete(k);
    }

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= current) {
      entry = { count: 0, resetAt: current + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    const remaining = Math.max(0, limit - entry.count);
    res.setHeader('RateLimit-Limit', String(limit));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader(
      'RateLimit-Reset',
      String(Math.ceil((entry.resetAt - current) / 1000)),
    );

    if (entry.count > limit) {
      res.setHeader(
        'Retry-After',
        String(Math.ceil((entry.resetAt - current) / 1000)),
      );
      return next(new TooManyRequestsError());
    }
    next();
  };
}
