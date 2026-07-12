'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Code2, Edit } from 'lucide-react';
import api from '@/lib/api-client';
import SkillForm from '@/components/admin/SkillForm';
import { Skill } from 'types';
import TableControls from '@/components/admin/TableControls';
import Modal from '@/components/admin/Modal';
import { showToast, showConfirm } from '@/lib/sweetalert';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 280, damping: 22 } 
  }
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilterCategory(val);
    setCurrentPage(1);
  };

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === '' ? true : s.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage) || 1;
  const paginatedSkills = filteredSkills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryOptions = Array.from(new Set(skills.map(s => s.category)))
    .map(cat => ({ value: cat, label: cat }));

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data.data || []);
    } catch {
      showToast('error', 'Failed to load skills');
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
    const result = await showConfirm(
      'Are you sure?',
      'You are about to delete this skill. This action cannot be undone.'
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/skills/${id}`);
        showToast('success', 'Skill deleted');
        fetchSkills();
      } catch {
        showToast('error', 'Failed to delete');
      }
    }
  };

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

      <div className="bg-surface/50 p-6 rounded-3xl border border-secondary/10">
        <TableControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search skills..."
          filterValue={filterCategory}
          onFilterChange={handleFilterChange}
          filterOptions={categoryOptions}
          filterPlaceholder="All Categories"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPagination={false}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-36 bg-secondary/10 rounded-[28px] animate-pulse" />)
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 col-span-full w-full"
          >
            {paginatedSkills.map((skill) => (
              <motion.div 
                key={skill.id} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 bg-surface/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-secondary/10 dark:border-white/5 flex flex-col items-center justify-center text-center group relative hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300 shadow-md shadow-primary/[0.01]"
              >
                <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-3 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                  <Code2 size={24} />
                </div>
                <h4 className="font-bold text-sm text-foreground">{skill.name}</h4>
                <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest font-bold">{skill.category}</p>
                
                {/* Proficiency Track Indicator */}
                <div className="w-full mt-4 space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-secondary">
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary/10 dark:bg-slate-950/40 rounded-full overflow-hidden border border-secondary/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_8px_rgba(14,165,233,0.25)]"
                    />
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button onClick={() => handleEdit(skill)} className="p-1.5 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(skill.id)} className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-8 px-2">
        <TableControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSkills.length}
          itemsPerPage={itemsPerPage}
          showSearchAndFilter={false}
        />
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
      >
        <SkillForm 
          skill={editingSkill}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchSkills();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
