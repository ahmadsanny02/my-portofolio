'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Code2, Edit } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';
import SkillForm from '@/components/admin/SkillForm';
import { Skill } from 'types';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data.data || []);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = () => {
    setEditingSkill(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      fetchSkills();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isFormOpen) {
    return (
      <SkillForm 
        skill={editingSkill}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchSkills();
        }}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-secondary text-sm sm:text-base">Update your technical expertise and tools.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-secondary/10 rounded-3xl animate-pulse" />)
        ) : skills.map((skill) => (
          <div key={skill.id} className="p-6 bg-surface rounded-3xl border border-secondary/5 flex flex-col items-center justify-center text-center group relative">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-3">
              <Code2 size={24} />
            </div>
            <h4 className="font-bold text-sm">{skill.name}</h4>
            <p className="text-xs text-secondary mt-1 uppercase tracking-widest font-bold">{skill.category}</p>
            
            <div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(skill)} className="p-1.5 hover:text-primary transition-colors"><Edit size={14} /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-1.5 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
