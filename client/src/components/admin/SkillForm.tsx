'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import api from '@/lib/api-client';
import { showToast } from '@/lib/sweetalert';
import { Skill } from 'types';
import { cn } from '@/lib/utils';

const skillSchema = z.object({
  name: z.string().min(1, 'Name required'),
  category: z.string().min(1, 'Category required'),
  proficiency: z.number().min(1, 'Proficiency must be at least 1%').max(100, 'Proficiency cannot exceed 100%'),
  orderIndex: z.number().default(0),
});

interface SkillFormProps {
  skill?: Skill;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || 'Frontend',
      proficiency: skill?.proficiency || 80,
      orderIndex: skill?.orderIndex || 0,
    }
  });

  const onSubmit = async (data: z.infer<typeof skillSchema>) => {
    setLoading(true);
    try {
      if (skill) {
        await api.put(`/skills/${skill.id}`, data);
        showToast('success', 'Skill updated!');
      } else {
        await api.post('/skills', data);
        showToast('success', 'Skill created!');
      }
      onSuccess();
    } catch {
      showToast('error', 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-foreground">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-secondary">Skill Name</label>
          <input 
            {...register('name')} 
            className={cn(
              "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all placeholder:text-secondary/30 text-sm",
              errors.name 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
            )} 
            placeholder="e.g. TypeScript" 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-secondary">Category</label>
          <select 
            {...register('category')} 
            className={cn(
              "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all text-sm cursor-pointer",
              errors.category 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
            )}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Mobile">Mobile</option>
            <option value="DevOps">DevOps</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-secondary">Proficiency (%)</label>
          <input 
            type="number" 
            {...register('proficiency', { valueAsNumber: true })} 
            className={cn(
              "w-full bg-background/50 dark:bg-slate-955/50 border rounded-2xl px-4 py-3.5 focus:ring-4 outline-none transition-all text-sm",
              errors.proficiency 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                : "border-secondary/20 dark:border-white/10 focus:border-primary focus:ring-primary/10"
            )} 
          />
          {errors.proficiency && <p className="text-red-500 text-xs mt-1">{errors.proficiency.message as string}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-secondary/10 text-foreground rounded-xl font-bold hover:bg-secondary/15 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Skill</>}
          </button>
        </div>
      </form>
    </>
  );
}
