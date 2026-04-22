import { supabase } from './SupabaseClient';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from 'types';
import { NotFoundError } from '../../../shared/errors/AppError';

export class ProjectSupabaseRepository implements IProjectRepository {
  async findAll(onlyPublished = true): Promise<Project[]> {
    let query = supabase.from('projects').select('*').order('order_index', { ascending: true });
    
    if (onlyPublished) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    // Map snake_case to camelCase if needed, but the types are already camelCase.
    // Assuming Supabase columns match the types for now. 
    // In real scenarios, we'd use a mapper.
    return data as unknown as Project[];
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return data as unknown as Project;
  }

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as unknown as Project;
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data: created, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return created as unknown as Project;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const { data: updated, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return updated as unknown as Project;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
