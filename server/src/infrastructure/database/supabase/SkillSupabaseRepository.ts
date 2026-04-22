import { supabase } from './SupabaseClient';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import type { Skill } from 'types';

export class SkillSupabaseRepository implements ISkillRepository {
  private mapToDomain(item: any): Skill {
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      iconUrl: item.icon_url,
      proficiency: item.proficiency,
      orderIndex: item.order_index,
      createdAt: item.created_at,
    };
  }

  private mapToDb(skill: Partial<Skill>): any {
    const dbItem: any = {
      name: skill.name,
      category: skill.category,
      icon_url: skill.iconUrl,
      proficiency: skill.proficiency,
      order_index: skill.orderIndex,
    };
    Object.keys(dbItem).forEach(key => dbItem[key] === undefined && delete dbItem[key]);
    return dbItem;
  }

  async findAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data.map(item => this.mapToDomain(item));
  }

  async create(data: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
    const dbData = this.mapToDb(data);
    const { data: created, error } = await supabase
      .from('skills')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    const dbData = this.mapToDb(data);
    const { data: updated, error } = await supabase
      .from('skills')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
