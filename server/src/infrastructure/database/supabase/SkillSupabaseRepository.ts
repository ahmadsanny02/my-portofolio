import { supabase } from './SupabaseClient';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from 'types';

export class SkillSupabaseRepository implements ISkillRepository {
  async findAll(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data as unknown as Skill[];
  }

  async create(data: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
    const { data: created, error } = await supabase
      .from('skills')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return created as unknown as Skill;
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    const { data: updated, error } = await supabase
      .from('skills')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return updated as unknown as Skill;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
