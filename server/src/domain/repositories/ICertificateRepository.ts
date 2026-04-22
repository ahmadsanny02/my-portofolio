import { Certificate } from 'types';

export interface ICertificateRepository {
  findAll(): Promise<Certificate[]>;
  create(data: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate>;
  delete(id: string): Promise<void>;
}
