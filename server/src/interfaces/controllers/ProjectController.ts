import { Request, Response, NextFunction } from 'express';
import { GetAllProjectsUseCase } from '../../application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectBySlugUseCase } from '../../application/use-cases/projects/GetProjectBySlugUseCase';
import { CreateProjectUseCase } from '../../application/use-cases/projects/CreateProjectUseCase';
import { UpdateProjectUseCase } from '../../application/use-cases/projects/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '../../application/use-cases/projects/DeleteProjectUseCase';

export class ProjectController {
  constructor(
    private getAllProjectsUseCase: GetAllProjectsUseCase,
    private getProjectBySlugUseCase: GetProjectBySlugUseCase,
    private createProjectUseCase: CreateProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyPublished = req.query.admin !== 'true';
      const projects = await this.getAllProjectsUseCase.execute(onlyPublished);
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const project = await this.getProjectBySlugUseCase.execute(slug);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await this.createProjectUseCase.execute(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const project = await this.updateProjectUseCase.execute(id, req.body);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await this.deleteProjectUseCase.execute(id);
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
