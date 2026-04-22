import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import type { Project } from 'types';
import { NotFoundError } from '../../../shared/errors/AppError';

export class GetProjectBySlugUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(slug: string): Promise<Project> {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) {
      throw new NotFoundError(`Project with slug ${slug} not found`);
    }
    return project;
  }
}
