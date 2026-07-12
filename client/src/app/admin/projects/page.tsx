'use client';

import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from 'types';
import api from '@/lib/api-client';
import Image from 'next/image';
import TableControls from '@/components/admin/TableControls';
import Modal from '@/components/admin/Modal';
import { showToast, showConfirm } from '@/lib/sweetalert';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }
};

export default function AdminProjectsPage() {
  const { projects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilterStatus(val);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === '' 
        ? true 
        : filterStatus === 'published' 
          ? p.isPublished 
          : !p.isPublished;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirm(
      'Are you sure?',
      'You are about to delete this project. This action cannot be undone.'
    );
    if (result.isConfirmed) {
      try {
        await api.delete(`/projects/${id}`);
        showToast('success', 'Project deleted!');
        window.location.reload(); // Quick refresh for now
      } catch {
        showToast('error', 'Failed to delete project');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-secondary text-sm sm:text-base">Manage your portfolio projects and case studies.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="bg-surface/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-secondary/10 dark:border-white/5 overflow-hidden shadow-xl shadow-primary/[0.02]">
        <div className="p-6 border-b border-secondary/10 bg-surface/30 dark:bg-slate-900/30">
          <TableControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search projects..."
            filterValue={filterStatus}
            onFilterChange={handleFilterChange}
            filterOptions={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' }
            ]}
            filterPlaceholder="All Statuses"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPagination={false}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/5 text-secondary text-xs font-bold uppercase tracking-widest border-b border-secondary/10">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-secondary/10 dark:divide-white/5"
            >
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-32 bg-secondary/10 rounded" />
                          <div className="h-3 w-20 bg-secondary/10 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-secondary/10 rounded-full animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-secondary/10 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-secondary/10 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-secondary/10 rounded animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedProjects.map((project) => (
                <motion.tr 
                  key={project.id} 
                  variants={itemVariants}
                  className="hover:bg-primary/[0.03] transition-all duration-300 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-secondary/15 overflow-hidden flex-shrink-0 relative transition-transform duration-300 group-hover:scale-105 shadow-inner">
                        <Image src={project.thumbnail || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" width={48} height={48} unoptimized />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-200">{project.title}</p>
                        <p className="text-xs text-secondary">{project.techStack.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      project.isPublished ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    )}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={() => handleEdit(project)} className="p-2 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"><Trash2 size={18} /></button>
                      <button className="p-2 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
        <div className="p-6 border-t border-secondary/10 dark:border-white/5 bg-surface/30 dark:bg-slate-900/30">
          <TableControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            showSearchAndFilter={false}
          />
        </div>
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingProject ? 'Edit Project' : 'Add Project'}
      >
        <ProjectForm 
          project={editingProject} 
          onSuccess={() => {
            setIsFormOpen(false);
            window.location.reload();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
