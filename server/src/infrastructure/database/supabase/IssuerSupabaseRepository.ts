import { supabase } from './SupabaseClient';
import { IIssuerRepository } from '../../../domain/repositories/IIssuerRepository';
import type { Issuer } from 'types';

export class IssuerSupabaseRepository implements IIssuerRepository {
  private mapToDomain(item: any): Issuer {
    return {
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      createdAt: item.created_at,
    };
  }

  private mapToDb(issuer: Partial<Issuer>): any {
    const dbItem: any = {
      name: issuer.name,
      logo_url: issuer.logoUrl,
    };
    Object.keys(dbItem).forEach(
      (key) => dbItem[key] === undefined && delete dbItem[key],
    );
    return dbItem;
  }

  async findAll(): Promise<Issuer[]> {
    const { data, error } = await supabase
      .from('issuers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async findById(id: string): Promise<Issuer | null> {
    const { data, error } = await supabase
      .from('issuers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async create(data: Omit<Issuer, 'id' | 'createdAt'>): Promise<Issuer> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('issuers')
      .insert(dbData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Issuer>): Promise<Issuer> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('issuers')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('issuers').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
