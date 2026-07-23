import type { Category } from 'types';

export interface ICategoryRepository {
  findAll(type?: string): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  update(id: string, data: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
