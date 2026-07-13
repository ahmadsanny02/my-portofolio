import { Router } from 'express';
import { ContactController } from '../controllers/ContactController';
import {
  GetAllContactMessagesUseCase,
  CreateContactMessageUseCase,
  DeleteContactMessageUseCase,
} from '../../application/use-cases/contact/ContactUseCases';
import { ContactSupabaseRepository } from '../../infrastructure/database/supabase/ContactSupabaseRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createContactMessageSchema } from '../validators/contactValidator';

const router = Router();

// Dependency Injection
const contactRepo = new ContactSupabaseRepository();
const getAllMessagesUseCase = new GetAllContactMessagesUseCase(contactRepo);
const createMessageUseCase = new CreateContactMessageUseCase(contactRepo);
const deleteMessageUseCase = new DeleteContactMessageUseCase(contactRepo);

const contactController = new ContactController(
  getAllMessagesUseCase,
  createMessageUseCase,
  deleteMessageUseCase,
);

// Public Routes
router.post('/', validateRequest(createContactMessageSchema), (req, res, next) =>
  contactController.create(req, res, next),
);

// Admin Routes (Protected)
router.get('/', authMiddleware, (req, res, next) =>
  contactController.getAll(req, res, next),
);

router.delete('/:id', authMiddleware, (req, res, next) =>
  contactController.delete(req, res, next),
);

export default router;
