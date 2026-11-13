import { supabase } from './SupabaseClient';
import { IContactRepository } from '../../../domain/repositories/IContactRepository';
import type { ContactMessage } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { omitUndefined } from '../../../shared/utils/omitUndefined';

interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export class ContactSupabaseRepository implements IContactRepository {
  private mapToDomain(item: ContactRow): ContactMessage {
    return omitUndefined({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject ?? undefined,
      message: item.message,
      isRead: item.is_read,
      created_at: item.created_at,
    }) as ContactMessage;
  }

  private mapToDb(message: Partial<ContactMessage>) {
    return omitUndefined({
      name: message.name,
      email: message.email,
      subject: message.subject || undefined,
      message: message.message,
      is_read: message.isRead,
    });
  }

  async findAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw mapDbError(error);
    return (data || []).map((item) => this.mapToDomain(item as ContactRow));
  }

  async create(
    data: Omit<ContactMessage, 'id' | 'created_at' | 'isRead'>,
  ): Promise<ContactMessage> {
    const { data: created, error } = await supabase
      .from('contact_messages')
      .insert(this.mapToDb(data))
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as ContactRow);
  }

  async setRead(id: string, isRead: boolean): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: isRead })
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(data as ContactRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw mapDbError(error);
    if (!data || data.length === 0) throw mapDbError({ code: 'PGRST116', message: '' });
  }
}
