import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { NotFoundError } from '../../../shared/errors/AppError';

export class DeleteProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Project not found');
    await this.projectRepo.delete(id);
  }
}
