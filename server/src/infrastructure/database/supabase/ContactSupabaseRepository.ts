import { supabase } from './SupabaseClient';
import { IContactRepository } from '../../../domain/repositories/IContactRepository';
import type { ContactMessage } from 'types';

export class ContactSupabaseRepository implements IContactRepository {
  private mapToDomain(item: any): ContactMessage {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      isRead: item.is_read,
      created_at: item.created_at,
    };
  }

  private mapToDb(message: Partial<ContactMessage>): any {
    const dbItem: any = {
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      is_read: message.isRead,
    };
    Object.keys(dbItem).forEach(
      (key) =>
        (dbItem[key] === undefined || dbItem[key] === '') && delete dbItem[key],
    );
    return dbItem;
  }

  async findAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map((item) => this.mapToDomain(item));
  }

  async create(
    data: Omit<ContactMessage, 'id' | 'created_at' | 'isRead'>,
  ): Promise<ContactMessage> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('contact_messages')
      .insert(dbData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
