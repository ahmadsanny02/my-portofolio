import { IContactRepository } from '../../../domain/repositories/IContactRepository';
import type { ContactMessage } from 'types';

export class GetAllContactMessagesUseCase {
  constructor(private contactRepo: IContactRepository) {}

  async execute(): Promise<ContactMessage[]> {
    return this.contactRepo.findAll();
  }
}

export class CreateContactMessageUseCase {
  constructor(private contactRepo: IContactRepository) {}

  async execute(
    data: Omit<ContactMessage, 'id' | 'created_at' | 'isRead'>,
  ): Promise<ContactMessage> {
    return this.contactRepo.create(data);
  }
}

export class DeleteContactMessageUseCase {
  constructor(private contactRepo: IContactRepository) {}

  async execute(id: string): Promise<void> {
    await this.contactRepo.delete(id);
  }
}
