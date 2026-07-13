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
