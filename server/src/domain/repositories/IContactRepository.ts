import type { ContactMessage } from 'types';

export interface IContactRepository {
  findAll(): Promise<ContactMessage[]>;
  create(data: Omit<ContactMessage, 'id' | 'created_at' | 'isRead'>): Promise<ContactMessage>;
  delete(id: string): Promise<void>;
}
