import { Router } from 'express';
import { CertificateController } from '../controllers/CertificateController';
import {
  GetAllCertificatesUseCase,
  CreateCertificateUseCase,
  UpdateCertificateUseCase,
  DeleteCertificateUseCase,
} from '../../application/use-cases/certificates/CertificateUseCases';
import { CertificateSupabaseRepository } from '../../infrastructure/database/supabase/CertificateSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const repo = new CertificateSupabaseRepository();
const getAll = new GetAllCertificatesUseCase(repo);
const create = new CreateCertificateUseCase(repo);
const update = new UpdateCertificateUseCase(repo);
const del = new DeleteCertificateUseCase(repo);
const controller = new CertificateController(getAll, create, update, del);

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.post('/', authMiddleware, (req, res, next) =>
  controller.create(req, res, next),
);
router.put('/:id', authMiddleware, (req, res, next) =>
  controller.update(req, res, next),
);
router.delete('/:id', authMiddleware, (req, res, next) =>
  controller.delete(req, res, next),
);

export default router;
