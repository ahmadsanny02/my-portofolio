import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { GetAllProjectsUseCase } from '../../application/use-cases/projects/GetAllProjectsUseCase';
import { GetProjectBySlugUseCase } from '../../application/use-cases/projects/GetProjectBySlugUseCase';
import { CreateProjectUseCase } from '../../application/use-cases/projects/CreateProjectUseCase';
import { UpdateProjectUseCase } from '../../application/use-cases/projects/UpdateProjectUseCase';
import { DeleteProjectUseCase } from '../../application/use-cases/projects/DeleteProjectUseCase';
import { ProjectSupabaseRepository } from '../../infrastructure/database/supabase/ProjectSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createProjectSchema, updateProjectSchema } from '../validators/projectValidator';

const router = Router();

// Dependency Injection
const projectRepo = new ProjectSupabaseRepository();
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepo);
const getProjectBySlugUseCase = new GetProjectBySlugUseCase(projectRepo);
const createProjectUseCase = new CreateProjectUseCase(projectRepo);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepo);
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo);

const projectController = new ProjectController(
  getAllProjectsUseCase,
  getProjectBySlugUseCase,
  createProjectUseCase,
  updateProjectUseCase,
  deleteProjectUseCase
);

// Public Routes
router.get('/', (req, res, next) => projectController.getAll(req, res, next));
router.get('/:slug', (req, res, next) => projectController.getBySlug(req, res, next));

// Admin Routes (Protected)
router.post(
  '/', 
  authMiddleware, 
  validateRequest(createProjectSchema), 
  (req, res, next) => projectController.create(req, res, next)
);

router.put(
  '/:id', 
  authMiddleware, 
  validateRequest(updateProjectSchema), 
  (req, res, next) => projectController.update(req, res, next)
);

router.delete(
  '/:id', 
  authMiddleware, 
  (req, res, next) => projectController.delete(req, res, next)
);

export default router;
