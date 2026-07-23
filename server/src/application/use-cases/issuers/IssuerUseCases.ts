import { IIssuerRepository } from '../../../domain/repositories/IIssuerRepository';
import type { Issuer } from 'types';

export class IssuerUseCases {
  constructor(private repo: IIssuerRepository) {}

  async getAll() {
    return this.repo.findAll();
  }
  async getById(id: string) {
    return this.repo.findById(id);
  }
  async create(data: Omit<Issuer, 'id' | 'createdAt'>) {
    return this.repo.create(data);
  }
  async update(id: string, data: Partial<Issuer>) {
    return this.repo.update(id, data);
  }
  async delete(id: string) {
    return this.repo.delete(id);
  }
}
