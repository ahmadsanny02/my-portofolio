'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Plus, Trash2, Code2 } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get('/skills');
        setSkills(data.data || []);
      } catch (error) {
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-secondary">Update your technical expertise and tools.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
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
            
            <button className="absolute top-4 right-4 p-2 text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
