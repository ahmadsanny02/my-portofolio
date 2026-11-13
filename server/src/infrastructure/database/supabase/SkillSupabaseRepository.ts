import { supabase } from './SupabaseClient';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import type { Skill } from 'types';
import { mapDbError } from '../../../shared/errors/mapDbError';
import { emptyToNull, omitUndefined } from '../../../shared/utils/omitUndefined';

interface SkillRow {
  id: string;
  name: string;
  category: string;
  icon_url: string | null;
  proficiency: number;
  order_index: number;
  created_at: string;
}

export class SkillSupabaseRepository implements ISkillRepository {
  private mapToDomain(item: SkillRow): Skill {
    return omitUndefined({
      id: item.id,
      name: item.name,
      category: item.category,
      iconUrl: item.icon_url ?? undefined,
      proficiency: item.proficiency,
      orderIndex: item.order_index,
      createdAt: item.created_at,
    }) as Skill;
  }

  private mapToDb(skill: Partial<Skill>) {
    return omitUndefined({
      name: skill.name,
      category: skill.category,
      icon_url: emptyToNull(skill.iconUrl),
      proficiency: skill.proficiency,
      order_index: skill.orderIndex,
    });
  }

  async findAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw mapDbError(error);
    return (data || []).map((item) => this.mapToDomain(item as SkillRow));
  }

  async create(data: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
    const { data: created, error } = await supabase
      .from('skills')
      .insert(this.mapToDb(data))
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(created as SkillRow);
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    const { data: updated, error } = await supabase
      .from('skills')
      .update(this.mapToDb(data))
      .eq('id', id)
      .select()
      .single();

    if (error) throw mapDbError(error);
    return this.mapToDomain(updated as SkillRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw mapDbError(error);
    if (!data || data.length === 0) throw mapDbError({ code: 'PGRST116', message: '' });
  }
}
