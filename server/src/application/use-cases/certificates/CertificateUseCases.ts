import { ICertificateRepository } from '../../../domain/repositories/ICertificateRepository';
import type { Certificate } from 'types';

export class GetAllCertificatesUseCase {
  constructor(private certRepo: ICertificateRepository) {}

  async execute(): Promise<Certificate[]> {
    return this.certRepo.findAll();
  }
}

export class CreateCertificateUseCase {
  constructor(private certRepo: ICertificateRepository) {}

  async execute(data: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate> {
    return this.certRepo.create(data);
  }
}

export class DeleteCertificateUseCase {
  constructor(private certRepo: ICertificateRepository) {}

  async execute(id: string): Promise<void> {
    await this.certRepo.delete(id);
  }
}
