import { supabase } from './SupabaseClient';
import { IIssuerRepository } from '../../../domain/repositories/IIssuerRepository';
import type { Issuer } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { emptyToNull, omitUndefined } from '../../../shared/utils/omitUndefined';

interface IssuerRow {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
}

export class IssuerSupabaseRepository implements IIssuerRepository {
  private mapToDomain(item: IssuerRow): Issuer {
    return omitUndefined({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url ?? undefined,
      createdAt: item.created_at,
    }) as Issuer;
  }

  private mapToDb(issuer: Partial<Issuer>) {
    return omitUndefined({ name: issuer.name, logo_url: emptyToNull(issuer.logoUrl) });
  }

  async findAll(): Promise<Issuer[]> {
    const { data, error } = await supabase
      .from('issuers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw mapDbError(error);
    return (data || []).map((item) => this.mapToDomain(item as IssuerRow));
  }

  async findById(id: string): Promise<Issuer | null> {
    const { data, error } = await supabase
      .from('issuers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw mapDbError(error);
    return data ? this.mapToDomain(data as IssuerRow) : null;
  }

  async create(data: Omit<Issuer, 'id' | 'createdAt'>): Promise<Issuer> {
    const { data: created, error } = await supabase
      .from('issuers')
      .insert(this.mapToDb(data))
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as IssuerRow);
  }

  async update(id: string, data: Partial<Issuer>): Promise<Issuer> {
    const { data: updated, error } = await supabase
      .from('issuers')
      .update(this.mapToDb(data))
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(updated as IssuerRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('issuers')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw mapDbError(error);
    if (!data || data.length === 0) throw mapDbError({ code: 'PGRST116', message: '' });
  }
}
