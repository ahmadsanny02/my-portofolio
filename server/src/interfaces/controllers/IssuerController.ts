import { Request, Response, NextFunction } from 'express';
import { IssuerUseCases } from '../../application/use-cases/issuers/IssuerUseCases';

export class IssuerController {
  constructor(private useCases: IssuerUseCases) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.useCases.getAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.useCases.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.useCases.update(
        req.params.id as string,
        req.body,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.useCases.delete(req.params.id as string);
      res.json({ success: true, message: 'Issuer deleted' });
    } catch (error) {
      next(error);
    }
  }
}
