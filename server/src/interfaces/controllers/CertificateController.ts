import { Request, Response, NextFunction } from 'express';
import { 
  GetAllCertificatesUseCase, 
  CreateCertificateUseCase, 
  UpdateCertificateUseCase,
  DeleteCertificateUseCase 
} from '../../application/use-cases/certificates/CertificateUseCases';

export class CertificateController {
  constructor(
    private getAllCerts: GetAllCertificatesUseCase,
    private createCert: CreateCertificateUseCase,
    private updateCert: UpdateCertificateUseCase,
    private deleteCert: DeleteCertificateUseCase
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const certs = await this.getAllCerts.execute();
      res.json({ success: true, data: certs });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cert = await this.createCert.execute(req.body);
      res.status(201).json({ success: true, data: cert });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const cert = await this.updateCert.execute(id, req.body);
      res.json({ success: true, data: cert });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await this.deleteCert.execute(id);
      res.json({ success: true, message: 'Certificate deleted' });
    } catch (error) {
      next(error);
    }
  }
}
