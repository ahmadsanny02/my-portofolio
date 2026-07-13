'use client';

import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Edit, Trash2, ExternalLink, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from 'types';
import api from '@/lib/api-client';
import Image from 'next/image';
import TableControls from '@/components/admin/TableControls';
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

  if (isFormOpen) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{editingProject ? 'Edit Project' : 'Add Project'}</h1>
          <p className="text-secondary text-sm sm:text-base">
            {editingProject ? `Editing details for "${editingProject.title}"` : 'Fill in the details to create a new portfolio project.'}
          </p>
        </div>

        <div className="bg-surface/50 p-6 sm:p-10 rounded-[32px] border border-secondary/10 dark:border-white/5 shadow-2xl backdrop-blur-md">
          <ProjectForm 
            project={editingProject} 
            onSuccess={() => {
              setIsFormOpen(false);
              window.location.reload();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </div>
    );
  }

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

      <div className="bg-surface/50 p-6 rounded-[32px] border border-secondary/10">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-secondary/10 rounded-[28px] animate-pulse" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-surface/50 rounded-[32px] border border-secondary/10">
            <p className="text-secondary">No projects found.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full w-full"
          >
            {paginatedProjects.map((project) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex flex-col bg-surface/50 backdrop-blur-md rounded-[32px] border border-secondary/10 dark:border-white/5 overflow-hidden group relative hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300 shadow-lg shadow-primary/[0.01]"
              >
                {/* Card Thumbnail */}
                <div className="h-48 w-full bg-background border-b border-secondary/10 dark:border-white/5 relative overflow-hidden flex-shrink-0">
                  {project.thumbnail ? (
                    <Image src={project.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" fill unoptimized />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                      <Code2 size={40} className="animate-pulse" />
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/25 text-amber-500 border border-amber-500/25 backdrop-blur-sm uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm uppercase tracking-wider border",
                      project.isPublished 
                        ? "bg-emerald-500/25 text-emerald-500 border-emerald-500/25" 
                        : "bg-orange-500/25 text-orange-500 border-orange-500/25"
                    )}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2" title={project.title}>
                      {project.title}
                    </h4>
                    
                    {/* Tech Stack Tags */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] bg-secondary/10 dark:bg-white/5 text-secondary font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-secondary/70 text-xs line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-secondary/10 dark:border-white/5">
                    {project.demoUrl ? (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 py-2.5 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    ) : (
                      <div className="flex-1 text-center py-2.5 rounded-xl text-xs text-secondary/40 font-semibold bg-secondary/5 border border-secondary/5 select-none">
                        No Demo
                      </div>
                    )}
                    <button 
                      onClick={() => handleEdit(project)} 
                      className="p-2.5 bg-secondary/10 hover:bg-secondary/20 hover:text-foreground text-secondary rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
          totalItems={filteredProjects.length}
          itemsPerPage={itemsPerPage}
          showSearchAndFilter={false}
        />
      </div>
    </div>
  );
}
