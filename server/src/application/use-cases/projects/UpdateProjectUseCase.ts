import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from 'types';
import { NotFoundError } from '../../../shared/errors/AppError';

export class UpdateProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Project not found');
    return this.projectRepo.update(id, data);
  }
}
