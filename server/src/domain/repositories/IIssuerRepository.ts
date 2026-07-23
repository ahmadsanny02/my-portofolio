import type { Issuer } from 'types';

export interface IIssuerRepository {
  findAll(): Promise<Issuer[]>;
  findById(id: string): Promise<Issuer | null>;
  create(data: Omit<Issuer, 'id' | 'createdAt'>): Promise<Issuer>;
  update(id: string, data: Partial<Issuer>): Promise<Issuer>;
  delete(id: string): Promise<void>;
}
