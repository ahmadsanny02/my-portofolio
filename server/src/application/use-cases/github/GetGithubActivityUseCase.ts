import type { GithubActivity } from 'types';
import { IGithubActivityProvider } from '../../../domain/repositories/IGithubActivityProvider';

const DEFAULT_TTL_MS = 10 * 60 * 1000;

/**
 * Serves GitHub activity through a short-lived in-memory cache.
 *
 * - Concurrent callers share a single upstream request (no thundering herd).
 * - If GitHub is unreachable, the last good snapshot is served instead of an
 *   error (stale-if-error), so the widget degrades gracefully.
 */
export class GetGithubActivityUseCase {
  private cache: { value: GithubActivity; expiresAt: number } | null = null;
  private inflight: Promise<GithubActivity> | null = null;

  constructor(
    private provider: IGithubActivityProvider,
    private username: string,
    private ttlMs = DEFAULT_TTL_MS,
    private now: () => number = Date.now,
  ) {}

  async execute(): Promise<GithubActivity> {
    if (this.cache && this.cache.expiresAt > this.now()) {
      return this.cache.value;
    }

    if (!this.inflight) {
      this.inflight = this.provider
        .fetchActivity(this.username)
        .then((value) => {
          this.cache = { value, expiresAt: this.now() + this.ttlMs };
          return value;
        })
        .finally(() => {
          this.inflight = null;
        });
    }

    try {
      return await this.inflight;
    } catch (error) {
      if (this.cache) return this.cache.value;
      throw error;
    }
  }
}
