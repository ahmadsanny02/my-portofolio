import { Router } from 'express';
import { SkillController } from '../controllers/SkillController';
import { SkillUseCases } from '../../application/use-cases/skills/SkillUseCases';
import { SkillSupabaseRepository } from '../../infrastructure/database/supabase/SkillSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new SkillController(
  new SkillUseCases(new SkillSupabaseRepository()),
);

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
