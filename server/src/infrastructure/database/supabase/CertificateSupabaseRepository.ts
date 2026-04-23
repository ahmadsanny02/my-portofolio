import { supabase } from './SupabaseClient';
import { ICertificateRepository } from '../../../domain/repositories/ICertificateRepository';
import type { Certificate } from 'types';

export class CertificateSupabaseRepository implements ICertificateRepository {
  private mapToDomain(item: any): Certificate {
    return {
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      issuedAt: item.issued_at,
      expiredAt: item.expired_at,
      imageUrl: item.image_url,
      credentialUrl: item.credential_url,
      category: item.category,
      createdAt: item.created_at,
    };
  }

  private mapToDb(cert: Partial<Certificate>): any {
    const dbItem: any = {
      title: cert.title,
      issuer: cert.issuer,
      issued_at: cert.issuedAt,
      expired_at: cert.expiredAt,
      image_url: cert.imageUrl,
      credential_url: cert.credentialUrl,
      category: cert.category,
    };
    Object.keys(dbItem).forEach(key => dbItem[key] === undefined && delete dbItem[key]);
    return dbItem;
  }

  async findAll(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issued_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data.map(item => this.mapToDomain(item));
  }

  async create(data: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('certificates')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Certificate>): Promise<Certificate> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('certificates')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
