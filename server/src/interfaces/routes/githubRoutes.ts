import { Router } from 'express';
import { GetGithubActivityUseCase } from '../../application/use-cases/github/GetGithubActivityUseCase';
import { GithubApiProvider } from '../../infrastructure/github/GithubApiProvider';
import { rateLimit } from '../middlewares/rateLimit';

const DEFAULT_GITHUB_USERNAME = 'ahmadsanny02';
/** GitHub login: alphanumeric or single hyphens, max 39 characters. */
const GITHUB_LOGIN_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/;

function resolveUsername(): string {
  const configured = process.env.GITHUB_USERNAME?.trim();
  if (configured && GITHUB_LOGIN_PATTERN.test(configured)) return configured;
  if (configured) {
    console.warn('[GitHub] GITHUB_USERNAME is not a valid login; using the default.');
  }
  return DEFAULT_GITHUB_USERNAME;
}

const router = Router();

// Dependency Injection
const getGithubActivity = new GetGithubActivityUseCase(
  new GithubApiProvider(),
  resolveUsername(),
);

const activityLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60 });

// Public: contribution calendar + recent commits for the portfolio owner
router.get('/activity', activityLimiter, async (_req, res, next) => {
  try {
    const data = await getGithubActivity.execute();
    // Let the CDN absorb traffic; the upstream snapshot is refreshed every 10 min
    res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=600, stale-while-revalidate=3600',
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
