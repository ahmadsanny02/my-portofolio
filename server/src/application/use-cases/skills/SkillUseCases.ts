import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from 'types';

export class SkillUseCases {
  constructor(private repo: ISkillRepository) {}

  async getAll() { return this.repo.findAll(); }
  async create(data: Omit<Skill, 'id' | 'createdAt'>) { return this.repo.create(data); }
  async update(id: string, data: Partial<Skill>) { return this.repo.update(id, data); }
  async delete(id: string) { return this.repo.delete(id); }
}
