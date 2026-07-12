'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import api from '@/lib/api-client';
import { showToast } from '@/lib/sweetalert';
import { Skill } from 'types';

const skillSchema = z.object({
  name: z.string().min(1, 'Name required'),
  category: z.string().min(1, 'Category required'),
  proficiency: z.number().min(1).max(100),
  orderIndex: z.number().default(0),
});

interface SkillFormProps {
  skill?: Skill;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || '',
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold">Skill Name</label>
          <input {...register('name')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. TypeScript" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Category</label>
          <select {...register('category')} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none">
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Mobile">Mobile</option>
            <option value="DevOps">DevOps</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Proficiency (%)</label>
          <input type="number" {...register('proficiency', { valueAsNumber: true })} className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:border-primary outline-none" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-secondary/10 text-foreground py-4 rounded-xl font-bold hover:bg-secondary/15 transition-all cursor-pointer"
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
