'use client';

import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from 'types';
import api from '@/lib/api-client';

export default function AdminProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted!');
        window.location.reload(); // Quick refresh for now
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (isFormOpen) {
    return (
      <ProjectForm 
        project={editingProject} 
        onSuccess={() => {
          setIsFormOpen(false);
          window.location.reload();
        }}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-secondary">Manage your portfolio projects and case studies.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="bg-surface rounded-3xl border border-secondary/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-secondary/5 flex justify-between items-center bg-surface">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-secondary/10 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/5 text-secondary text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 bg-secondary/5" />
                  </tr>
                ))
              ) : filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-background border border-secondary/10 overflow-hidden flex-shrink-0">
                        <img src={project.thumbnail || ''} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{project.title}</p>
                        <p className="text-xs text-secondary">{project.techStack.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      project.isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                    )}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(project)} className="p-2 hover:text-primary transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      <button className="p-2 hover:text-primary transition-colors"><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
