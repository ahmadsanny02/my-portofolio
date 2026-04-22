import { supabase } from './SupabaseClient';
import { ICertificateRepository } from '../../../domain/repositories/ICertificateRepository';
import { Certificate } from 'types';

export class CertificateSupabaseRepository implements ICertificateRepository {
  async findAll(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issued_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as unknown as Certificate[];
  }

  async create(data: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate> {
    const { data: created, error } = await supabase
      .from('certificates')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return created as unknown as Certificate;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
