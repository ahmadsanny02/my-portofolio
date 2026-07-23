import { supabase } from './SupabaseClient';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import type { Category } from 'types';

export class CategorySupabaseRepository implements ICategoryRepository {
  private mapToDomain(item: any): Category {
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      createdAt: item.created_at,
    };
  }

  private mapToDb(category: Partial<Category>): any {
    const dbItem: any = {
      name: category.name,
      type: category.type,
    };
    Object.keys(dbItem).forEach(
      (key) => dbItem[key] === undefined && delete dbItem[key],
    );
    return dbItem;
  }

  async findAll(type?: string): Promise<Category[]> {
    let query = supabase.from('categories').select('*').order('name', { ascending: true });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((item) => this.mapToDomain(item));
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('categories')
      .insert(dbData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('categories')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
