import { Request, Response, NextFunction } from 'express';
import {
  GetAllContactMessagesUseCase,
  CreateContactMessageUseCase,
  DeleteContactMessageUseCase,
} from '../../application/use-cases/contact/ContactUseCases';

export class ContactController {
  constructor(
    private getAllMessages: GetAllContactMessagesUseCase,
    private createMessage: CreateContactMessageUseCase,
    private deleteMessage: DeleteContactMessageUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await this.getAllMessages.execute();
      res.json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await this.createMessage.execute(req.body);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await this.deleteMessage.execute(id);
      res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
