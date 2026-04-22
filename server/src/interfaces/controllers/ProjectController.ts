import { Request, Response, NextFunction } from 'express';
import { GetAllProjectsUseCase } from '../../application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectBySlugUseCase } from '../../application/use-cases/projects/GetProjectBySlugUseCase';

export class ProjectController {
  constructor(
    private getAllProjectsUseCase: GetAllProjectsUseCase,
    private getProjectBySlugUseCase: GetProjectBySlugUseCase
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
      const { slug } = req.params;
      const project = await this.getProjectBySlugUseCase.execute(slug);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }
}
