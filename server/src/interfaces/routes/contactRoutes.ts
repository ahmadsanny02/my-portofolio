import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
import {
  GetAllContactMessagesUseCase,
  CreateContactMessageUseCase,
  DeleteContactMessageUseCase,
  MarkContactMessageReadUseCase,
} from '../../application/use-cases/contact/ContactUseCases';
import { ContactSupabaseRepository } from '../../infrastructure/database/supabase/ContactSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { validateId } from '../middlewares/validateId';
import {
  createContactMessageSchema,
  markReadSchema,
} from '../validators/contactValidator';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();

// Dependency Injection
const contactRepo = new ContactSupabaseRepository();
const getAllMessagesUseCase = new GetAllContactMessagesUseCase(contactRepo);
const createMessageUseCase = new CreateContactMessageUseCase(contactRepo);
const deleteMessageUseCase = new DeleteContactMessageUseCase(contactRepo);
const markReadUseCase = new MarkContactMessageReadUseCase(contactRepo);

const contactController = new ContactController(
  getAllMessagesUseCase,
  createMessageUseCase,
  deleteMessageUseCase,
  markReadUseCase,
);

// Max 5 messages per IP per 15 minutes
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 });

// Public Routes
router.post(
  '/',
  contactLimiter,
  validateRequest(createContactMessageSchema),
  (req, res, next) => contactController.create(req, res, next),
);

// Admin Routes (Protected)
router.get('/', authMiddleware, (req, res, next) =>
  contactController.getAll(req, res, next),
);

router.patch(
  '/:id/read',
  authMiddleware,
  validateId,
  validateRequest(markReadSchema),
  (req, res, next) => contactController.markRead(req, res, next),
);

router.delete('/:id', authMiddleware, validateId, (req, res, next) =>
  contactController.delete(req, res, next),
);

export default router;
