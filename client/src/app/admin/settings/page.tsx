'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderTree, 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  Check, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useIssuers } from '@/hooks/useIssuers';
import api from '@/lib/api-client';
import { showToast, showConfirm } from '@/lib/sweetalert';
import { Category, Issuer, CategoryType } from 'types';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'issuers'>('categories');
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { categories, loading: loadingCategories, refresh: refreshCategories } = useCategories(categoryTypeFilter);
  const { issuers, loading: loadingIssuers, refresh: refreshIssuers } = useIssuers();

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>('project');
  const [isCategoryTypeDropdownOpen, setIsCategoryTypeDropdownOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  // Issuer Modal State
  const [isIssuerModalOpen, setIsIssuerModalOpen] = useState(false);
  const [editingIssuer, setEditingIssuer] = useState<Issuer | null>(null);
  const [issuerName, setIssuerName] = useState('');
  const [issuerLogoUrl, setIssuerLogoUrl] = useState('');
  const [savingIssuer, setSavingIssuer] = useState(false);

  // Filter Categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Issuers by search
  const filteredIssuers = issuers.filter((iss) =>
    iss.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers for Category
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryType('project');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryType(cat.type);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showToast('error', 'Category name is required');
      return;
    }
    setSavingCategory(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name: categoryName.trim(),
          type: categoryType,
        });
        showToast('success', 'Category updated successfully');
      } else {
        await api.post('/categories', {
          name: categoryName.trim(),
          type: categoryType,
        });
        showToast('success', 'Category created successfully');
      }
      setIsCategoryModalOpen(false);
      refreshCategories();
    } catch {
      showToast('error', 'Failed to save category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const res = await showConfirm('Delete Category?', `Are you sure you want to delete category "${name}"?`);
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast('success', 'Category deleted');
      refreshCategories();
    } catch {
      showToast('error', 'Failed to delete category');
    }
  };

  // Handlers for Issuer
  const openAddIssuerModal = () => {
    setEditingIssuer(null);
    setIssuerName('');
    setIssuerLogoUrl('');
    setIsIssuerModalOpen(true);
  };

  const openEditIssuerModal = (iss: Issuer) => {
    setEditingIssuer(iss);
    setIssuerName(iss.name);
    setIssuerLogoUrl(iss.logoUrl || '');
    setIsIssuerModalOpen(true);
  };

  const handleSaveIssuer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuerName.trim()) {
      showToast('error', 'Issuer name is required');
      return;
    }
    setSavingIssuer(true);
    try {
      if (editingIssuer) {
        await api.put(`/issuers/${editingIssuer.id}`, {
          name: issuerName.trim(),
          logoUrl: issuerLogoUrl.trim() || undefined,
        });
        showToast('success', 'Issuer updated successfully');
      } else {
        await api.post('/issuers', {
          name: issuerName.trim(),
          logoUrl: issuerLogoUrl.trim() || undefined,
        });
        showToast('success', 'Issuer created successfully');
      }
      setIsIssuerModalOpen(false);
      refreshIssuers();
    } catch {
      showToast('error', 'Failed to save issuer');
    } finally {
      setSavingIssuer(false);
    }
  };

  const handleDeleteIssuer = async (id: string, name: string) => {
    const res = await showConfirm('Delete Issuer?', `Are you sure you want to delete issuer "${name}"?`);
    if (!res.isConfirmed) return;
    try {
      await api.delete(`/issuers/${id}`);
      showToast('success', 'Issuer deleted');
      refreshIssuers();
    } catch {
      showToast('error', 'Failed to delete issuer');
    }
  };

  const categoryTypeOptions: { value: CategoryType; label: string }[] = [
    { value: 'project', label: 'Project Category' },
    { value: 'skill', label: 'Skill Category' },
    { value: 'certificate', label: 'Certificate Category' },
    { value: 'general', label: 'General Category' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
            System Settings
          </h1>
          <p className="text-secondary text-sm mt-1">
            Manage global categories and certificate issuers across your portfolio monorepo.
          </p>
        </div>

        <button
          onClick={activeTab === 'categories' ? openAddCategoryModal : openAddIssuerModal}
          className="px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105 cursor-pointer text-sm"
        >
          <Plus size={18} />
          <span>Add New {activeTab === 'categories' ? 'Category' : 'Issuer'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-surface/40 backdrop-blur-md border border-secondary/10 dark:border-white/5 rounded-[32px] p-6 lg:p-8 shadow-xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-secondary/10 pb-6">
          <div className="flex bg-background/50 p-1.5 rounded-2xl border border-secondary/10 dark:border-white/5 gap-1">
            <button
              onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer",
                activeTab === 'categories'
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-secondary hover:text-foreground hover:bg-secondary/5"
              )}
            >
              <FolderTree size={16} />
              <span>Category Management</span>
            </button>
            <button
              onClick={() => { setActiveTab('issuers'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer",
                activeTab === 'issuers'
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-secondary hover:text-foreground hover:bg-secondary/5"
              )}
            >
              <Building2 size={16} />
              <span>Issuer Management</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-secondary/20 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-secondary/50"
            />
          </div>
        </div>

        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Category Type Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Layers size={14} /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'project', label: 'Project' },
                { id: 'skill', label: 'Skill' },
                { id: 'certificate', label: 'Certificate' },
                { id: 'general', label: 'General' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCategoryTypeFilter(pill.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                    categoryTypeFilter === pill.id
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-background/40 text-secondary border-secondary/10 hover:text-foreground hover:border-secondary/20"
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Table / Grid list */}
            {loadingCategories ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-secondary/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16 bg-background/30 rounded-2xl border border-secondary/10 text-secondary space-y-2">
                <FolderTree size={32} className="mx-auto text-secondary/40" />
                <p className="font-semibold text-sm">No categories found</p>
                <p className="text-xs text-secondary/60">Try adding a new category or changing your filter.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="p-5 bg-background/60 dark:bg-slate-900/50 border border-secondary/10 dark:border-white/5 rounded-2xl hover:border-primary/30 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
                        {category.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCategoryModal(category)}
                        className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Issuers Tab Content */}
        {activeTab === 'issuers' && (
          <div className="space-y-6">
            {loadingIssuers ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-secondary/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredIssuers.length === 0 ? (
              <div className="text-center py-16 bg-background/30 rounded-2xl border border-secondary/10 text-secondary space-y-2">
                <Building2 size={32} className="mx-auto text-secondary/40" />
                <p className="font-semibold text-sm">No issuers found</p>
                <p className="text-xs text-secondary/60">Try adding a new certification issuer.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIssuers.map((issuer) => (
                  <div
                    key={issuer.id}
                    className="p-5 bg-background/60 dark:bg-slate-900/50 border border-secondary/10 dark:border-white/5 rounded-2xl hover:border-primary/30 transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {issuer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                          {issuer.name}
                        </h3>
                        {issuer.logoUrl ? (
                          <span className="text-[10px] text-secondary truncate max-w-[140px] block">
                            {issuer.logoUrl}
                          </span>
                        ) : (
                          <span className="text-[10px] text-secondary/60 italic block">
                            No logo specified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditIssuerModal(issuer)}
                        className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                        title="Edit issuer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteIssuer(issuer.id, issuer.name)}
                        className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Delete issuer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Add/Edit Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-secondary/15 rounded-[32px] p-6 lg:p-8 max-w-md w-full z-10 shadow-2xl relative space-y-6"
            >
              <div className="flex justify-between items-center border-b border-secondary/10 pb-4">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <FolderTree size={20} className="text-primary" />
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-secondary hover:text-foreground rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Web Application"
                    className="w-full bg-background border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Category Type / Module
                  </label>

                  {isCategoryTypeDropdownOpen && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoryTypeDropdownOpen(false)}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setIsCategoryTypeDropdownOpen(!isCategoryTypeDropdownOpen)}
                    className="w-full flex items-center justify-between bg-background border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer relative z-20 text-left"
                  >
                    <span>
                      {categoryTypeOptions.find((o) => o.value === categoryType)?.label || categoryType}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-secondary transition-transform",
                        isCategoryTypeDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isCategoryTypeDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-surface border border-secondary/15 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                      {categoryTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setCategoryType(option.value);
                            setIsCategoryTypeDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 text-xs text-left rounded-xl transition-all cursor-pointer font-semibold",
                            categoryType === option.value
                              ? "text-primary bg-primary/10 font-bold"
                              : "text-secondary hover:text-foreground hover:bg-secondary/5"
                          )}
                        >
                          <span>{option.label}</span>
                          {categoryType === option.value && <Check size={14} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-secondary/10">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/15 text-foreground rounded-2xl font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingCategory}
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {savingCategory ? <Loader2 size={16} className="animate-spin" /> : 'Save Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Issuer Add/Edit Modal */}
      <AnimatePresence>
        {isIssuerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIssuerModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface border border-secondary/15 rounded-[32px] p-6 lg:p-8 max-w-md w-full z-10 shadow-2xl relative space-y-6"
            >
              <div className="flex justify-between items-center border-b border-secondary/10 pb-4">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Building2 size={20} className="text-primary" />
                  {editingIssuer ? 'Edit Issuer' : 'Add Issuer'}
                </h3>
                <button
                  onClick={() => setIsIssuerModalOpen(false)}
                  className="p-2 text-secondary hover:text-foreground rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveIssuer} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Issuer Name
                  </label>
                  <input
                    type="text"
                    value={issuerName}
                    onChange={(e) => setIssuerName(e.target.value)}
                    placeholder="e.g. Coursera, Google, Dicoding"
                    className="w-full bg-background border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={issuerLogoUrl}
                    onChange={(e) => setIssuerLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-background border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-secondary/10">
                  <button
                    type="button"
                    onClick={() => setIsIssuerModalOpen(false)}
                    className="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/15 text-foreground rounded-2xl font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingIssuer}
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer text-xs shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {savingIssuer ? <Loader2 size={16} className="animate-spin" /> : 'Save Issuer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
