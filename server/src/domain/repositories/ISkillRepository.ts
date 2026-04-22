import { Skill } from 'types';

export interface ISkillRepository {
  findAll(): Promise<Skill[]>;
  create(data: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill>;
  update(id: string, data: Partial<Skill>): Promise<Skill>;
  delete(id: string): Promise<void>;
}
