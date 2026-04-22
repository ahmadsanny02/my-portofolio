import type { Project } from 'types';

export interface IProjectRepository {
  findAll(onlyPublished?: boolean): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}
