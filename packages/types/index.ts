export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  category?: string;
  status?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiredAt?: string;
  imageUrl: string;
  credentialUrl?: string;
  category: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  proficiency: number;
  orderIndex: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export type CategoryType = 'project' | 'certificate' | 'skill' | 'general';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  createdAt: string;
}

export interface Issuer {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
}


/** Maximum accepted upload size (bytes), shared by client validation and server multer limit. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Image MIME types accepted by the upload endpoint (SVG deliberately excluded). */
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startYear: number;
  /** Omit while the programme is still in progress. */
  endYear?: number;
  location?: string;
  description?: string;
}

/** GitHub contribution intensity bucket: 0 = none, 4 = highest quartile. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface GithubCommit {
  sha: string;
  message: string;
  /** `owner/name` */
  repo: string;
  url: string;
  /** ISO timestamp. */
  date: string;
}

export interface GithubActivity {
  username: string;
  profileUrl: string;
  /** Contributions in the last year; null when the calendar is unavailable (no API token). */
  totalContributions: number | null;
  /** Calendar weeks (oldest first), each holding up to 7 days; null when unavailable. */
  weeks: ContributionDay[][] | null;
  recentCommits: GithubCommit[];
  /** ISO timestamp of when the server fetched this snapshot. */
  fetchedAt: string;
}
