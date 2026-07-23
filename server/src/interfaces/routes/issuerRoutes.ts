import { Router } from 'express';
import { IssuerController } from '../controllers/IssuerController';
import { IssuerUseCases } from '../../application/use-cases/issuers/IssuerUseCases';
import { IssuerSupabaseRepository } from '../../infrastructure/database/supabase/IssuerSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createIssuerSchema,
  updateIssuerSchema,
} from '../validators/issuerValidator';

const router = Router();
const controller = new IssuerController(
  new IssuerUseCases(new IssuerSupabaseRepository()),
);

router.get('/', (req, res, next) => controller.getAll(req, res, next));

router.post(
  '/',
  authMiddleware,
  validateRequest(createIssuerSchema),
  (req, res, next) => controller.create(req, res, next),
);

router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateIssuerSchema),
  (req, res, next) => controller.update(req, res, next),
);

router.delete('/:id', authMiddleware, (req, res, next) =>
  controller.delete(req, res, next),
);

export default router;
