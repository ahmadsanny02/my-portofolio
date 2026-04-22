import { supabase } from './SupabaseClient';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import type { Project } from 'types';

export class ProjectSupabaseRepository implements IProjectRepository {
  private mapToDomain(item: any): Project {
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      longDescription: item.long_description,
      thumbnail: item.thumbnail,
      techStack: item.tech_stack || [],
      demoUrl: item.demo_url,
      repoUrl: item.repo_url,
      isFeatured: item.is_featured,
      isPublished: item.is_published,
      orderIndex: item.order_index,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  }

  private mapToDb(project: Partial<Project>): any {
    const dbItem: any = {
      title: project.title,
      slug: project.slug,
      description: project.description,
      long_description: project.longDescription,
      thumbnail: project.thumbnail,
      tech_stack: project.techStack,
      demo_url: project.demoUrl,
      repo_url: project.repoUrl,
      is_featured: project.isFeatured,
      is_published: project.isPublished,
      order_index: project.orderIndex,
    };
    
    // Remove undefined keys
    Object.keys(dbItem).forEach(key => dbItem[key] === undefined && delete dbItem[key]);
    return dbItem;
  }

  async findAll(onlyPublished = true): Promise<Project[]> {
    let query = supabase.from('projects').select('*').order('order_index', { ascending: true });
    
    if (onlyPublished) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data.map(item => this.mapToDomain(item));
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return this.mapToDomain(data);
  }

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return this.mapToDomain(data);
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('projects')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('projects')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
