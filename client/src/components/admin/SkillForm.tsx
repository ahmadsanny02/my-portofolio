'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Save, Code2 } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || '',
      proficiency: skill?.proficiency || 80,
      orderIndex: skill?.orderIndex || 0,
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (skill) {
        await api.put(`/skills/${skill.id}`, data);
        toast.success('Skill updated!');
      } else {
        await api.post('/skills', data);
        toast.success('Skill created!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-8 rounded-3xl border border-secondary/5 shadow-xl max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{skill ? 'Edit Skill' : 'New Skill'}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-secondary/10 rounded-full"><X size={24} /></button>
      </div>

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

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Skill</>}
        </button>
      </form>
    </div>
  );
}
