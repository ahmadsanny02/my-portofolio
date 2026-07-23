import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryUseCases } from '../../application/use-cases/categories/CategoryUseCases';
import { CategorySupabaseRepository } from '../../infrastructure/database/supabase/CategorySupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categoryValidator';

const router = Router();
const controller = new CategoryController(
  new CategoryUseCases(new CategorySupabaseRepository()),
);

router.get('/', (req, res, next) => controller.getAll(req, res, next));

router.post(
  '/',
  authMiddleware,
  validateRequest(createCategorySchema),
  (req, res, next) => controller.create(req, res, next),
);

router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateCategorySchema),
  (req, res, next) => controller.update(req, res, next),
);

router.delete('/:id', authMiddleware, (req, res, next) =>
  controller.delete(req, res, next),
);

export default router;
