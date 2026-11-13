import { supabase } from './SupabaseClient';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import type { Project } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { emptyToNull, omitUndefined } from '../../../shared/utils/omitUndefined';

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  thumbnail: string | null;
  tech_stack: string[] | null;
  demo_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  images: string[] | null;
  category: string | null;
  status: string | null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export class ProjectSupabaseRepository implements IProjectRepository {
  private mapToDomain(item: ProjectRow): Project {
    return omitUndefined({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description ?? '',
      longDescription: item.long_description ?? undefined,
      thumbnail: item.thumbnail ?? '',
      techStack: item.tech_stack || [],
      demoUrl: item.demo_url ?? undefined,
      repoUrl: item.repo_url ?? undefined,
      isFeatured: item.is_featured,
      isPublished: item.is_published,
      orderIndex: item.order_index,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      images: item.images || [],
      category: item.category || 'Web Application',
      status: item.status || 'Completed',
    }) as Project;
  }

  private mapToDb(project: Partial<Project>) {
    return omitUndefined({
      title: project.title,
      slug: project.slug,
      description: project.description,
      long_description: project.longDescription,
      thumbnail: emptyToNull(project.thumbnail),
      tech_stack: project.techStack,
      demo_url: emptyToNull(project.demoUrl),
      repo_url: emptyToNull(project.repoUrl),
      is_featured: project.isFeatured,
      is_published: project.isPublished,
      order_index: project.orderIndex,
      images: project.images,
      category: project.category,
      status: project.status,
    });
  }

  async findAll(onlyPublished = true): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (onlyPublished) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) throw mapDbError(error);

    return (data || []).map((item) => this.mapToDomain(item as ProjectRow));
  }

  async findBySlug(slug: string, onlyPublished = true): Promise<Project | null> {
    let query = supabase.from('projects').select('*').eq('slug', slug);
    if (onlyPublished) query = query.eq('is_published', true);

    const { data, error } = await query.maybeSingle();
    if (error) throw mapDbError(error);
    return data ? this.mapToDomain(data as ProjectRow) : null;
  }

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw mapDbError(error);
    return data ? this.mapToDomain(data as ProjectRow) : null;
  }

  async create(
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Project> {
    const dbData = this.mapToDb({ ...data, slug: data.slug || slugify(data.title) });
    const { data: created, error } = await supabase
      .from('projects')
      .insert(dbData)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as ProjectRow);
  }

  // Slug is intentionally NOT regenerated from the title on update, so
  // existing public URLs keep working. It only changes if sent explicitly.
  async update(id: string, data: Partial<Project>): Promise<Project> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('projects')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(updated as ProjectRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw mapDbError(error);
  }
}
