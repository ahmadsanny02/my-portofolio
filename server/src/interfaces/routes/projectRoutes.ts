import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { GetAllProjectsUseCase } from '../../application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectBySlugUseCase } from '../../application/use-cases/projects/GetProjectBySlugUseCase';
import { ProjectSupabaseRepository } from '../../infrastructure/database/supabase/ProjectSupabaseRepository';

const router = Router();

// Dependency Injection (Composition Root for Project)
const projectRepo = new ProjectSupabaseRepository();
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepo);
const getProjectBySlugUseCase = new GetProjectBySlugUseCase(projectRepo);
const projectController = new ProjectController(
  getAllProjectsUseCase,
  getProjectBySlugUseCase
);

// Routes
router.get('/', (req, res, next) => projectController.getAll(req, res, next));
router.get('/:slug', (req, res, next) => projectController.getBySlug(req, res, next));

export default router;
