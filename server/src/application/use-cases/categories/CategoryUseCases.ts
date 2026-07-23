import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import type { Category } from 'types';

export class CategoryUseCases {
  constructor(private repo: ICategoryRepository) {}

  async getAll(type?: string) {
    return this.repo.findAll(type);
  }
  async getById(id: string) {
    return this.repo.findById(id);
  }
  async create(data: Omit<Category, 'id' | 'createdAt'>) {
    return this.repo.create(data);
  }
  async update(id: string, data: Partial<Category>) {
    return this.repo.update(id, data);
  }
  async delete(id: string) {
    return this.repo.delete(id);
  }
}
