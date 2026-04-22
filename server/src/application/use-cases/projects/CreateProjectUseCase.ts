import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from 'types';

export class CreateProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    return this.projectRepo.create(data);
  }
}
