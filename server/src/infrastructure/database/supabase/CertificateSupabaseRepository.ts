import { supabase } from './SupabaseClient';
import { ICertificateRepository } from '../../../domain/repositories/ICertificateRepository';
import type { Certificate } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { emptyToNull, omitUndefined } from '../../../shared/utils/omitUndefined';

interface CertificateRow {
  id: string;
  title: string;
  issuer: string;
  issued_at: string;
  expired_at: string | null;
  image_url: string | null;
  credential_url: string | null;
  category: string | null;
  created_at: string;
}

/**
 * Map a (partial) domain certificate to DB columns.
 * - `undefined` → key omitted (partial update leaves the column untouched)
 * - `''`        → `null` (explicitly clears an optional column)
 */
export function certificateToDb(cert: Partial<Certificate>) {
  return omitUndefined({
    title: cert.title,
    issuer: cert.issuer,
    issued_at: cert.issuedAt,
    expired_at: emptyToNull(cert.expiredAt),
    image_url: emptyToNull(cert.imageUrl),
    credential_url: emptyToNull(cert.credentialUrl),
    category: cert.category,
  });
}

export class CertificateSupabaseRepository implements ICertificateRepository {
  private mapToDomain(item: CertificateRow): Certificate {
    return omitUndefined({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      issuedAt: item.issued_at,
      expiredAt: item.expired_at ?? undefined,
      imageUrl: item.image_url ?? '',
      credentialUrl: item.credential_url ?? undefined,
      category: item.category ?? '',
      createdAt: item.created_at,
    }) as Certificate;
  }

  async findAll(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issued_at', { ascending: false });

    if (error) throw mapDbError(error);
    return (data || []).map((item) => this.mapToDomain(item as CertificateRow));
  }

  async create(
    data: Omit<Certificate, 'id' | 'createdAt'>,
  ): Promise<Certificate> {
    const { data: created, error } = await supabase
      .from('certificates')
      .insert(certificateToDb(data))
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as CertificateRow);
  }

  async update(id: string, data: Partial<Certificate>): Promise<Certificate> {
    const { data: updated, error } = await supabase
      .from('certificates')
      .update(certificateToDb(data))
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(updated as CertificateRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw mapDbError(error);
    if (!data || data.length === 0) throw mapDbError({ code: 'PGRST116', message: '' });
  }
}
