import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import type { Project } from 'types';

export class GetAllProjectsUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(onlyPublished = true): Promise<Project[]> {
    return this.projectRepo.findAll(onlyPublished);
  }
}
