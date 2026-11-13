import { supabase } from './SupabaseClient';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import type { Category, CategoryType } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { omitUndefined } from '../../../shared/utils/omitUndefined';

interface CategoryRow {
  id: string;
  name: string;
  type: CategoryType;
  created_at: string;
}

export class CategorySupabaseRepository implements ICategoryRepository {
  private mapToDomain(item: CategoryRow): Category {
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      createdAt: item.created_at,
    };
  }

  private mapToDb(category: Partial<Category>) {
    return omitUndefined({ name: category.name, type: category.type });
  }

  async findAll(type?: string): Promise<Category[]> {
    let query = supabase.from('categories').select('*').order('name', { ascending: true });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw mapDbError(error);
    return (data || []).map((item) => this.mapToDomain(item as CategoryRow));
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw mapDbError(error);
    return data ? this.mapToDomain(data as CategoryRow) : null;
  }

  async create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const { data: created, error } = await supabase
      .from('categories')
      .insert(this.mapToDb(data))
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as CategoryRow);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const { data: updated, error } = await supabase
      .from('categories')
      .update(this.mapToDb(data))
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(updated as CategoryRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw mapDbError(error);
    if (!data || data.length === 0) throw mapDbError({ code: 'PGRST116', message: '' });
  }
}
