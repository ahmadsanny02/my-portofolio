// app/dashboard/projects/page.tsx
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import { Project, TechStackItem } from 'types';
import { TechStackField } from '@/app/components/dashboard/TechStackField';
import Image from 'next/image';

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);

    // form fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [techStack, setTechStack] = useState<TechStackItem[]>([]);

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setCategory('');
        setDescription('');
        setProjectUrl('');
        setGithubUrl('');
        setImageFile(null);
        setTechStack([]);
    };

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setProjects((data || []) as Project[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const uploadImageIfNeeded = async (file: File | null, existingUrl?: string | null) => {
        if (!file) return existingUrl || null;

        const ext = file.name.split('.').pop();
        const fileName = `projects/${Date.now()}.${ext}`;
        const { data, error } = await supabase.storage
            .from('project-images')
            .upload(fileName, file);

        if (error) {
            throw error;
        }

        const { data: publicData } = supabase.storage
            .from('project-images')
            .getPublicUrl(data.path);

        return publicData.publicUrl;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg('');

        try {
            let imageUrl: string | null = null;

            if (editingId) {
                const current = projects.find(p => p.id === editingId);
                imageUrl = await uploadImageIfNeeded(imageFile, current?.image_url || null);

                const { error } = await supabase
                    .from('projects')
                    .update({
                        title,
                        category,
                        description,
                        project_url: projectUrl || null,
                        github_url: githubUrl || null,
                        image_url: imageUrl,
                        tech_stack: techStack,
                    })
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                imageUrl = await uploadImageIfNeeded(imageFile, null);

                const { error } = await supabase.from('projects').insert({
                    title,
                    category,
                    description,
                    project_url: projectUrl || null,
                    github_url: githubUrl || null,
                    image_url: imageUrl,
                    tech_stack: techStack,
                });

                if (error) throw error;
            }

            await fetchProjects();
            resetForm();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) { 
            setErrorMsg(err.message || 'Gagal menyimpan project');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setTitle(project.title);
        setCategory(project.category ?? '');
        setDescription(project.description ?? '');
        setProjectUrl(project.project_url ?? '');
        setGithubUrl(project.github_url ?? '');
        setImageFile(null);
        setTechStack(project.tech_stack || []);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus project ini?')) return;

        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
            setErrorMsg(error.message);
            return;
        }
        setProjects(prev => prev.filter(p => p.id !== id));
        if (editingId === id) resetForm();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-2">Projects</h1>
                <p className="text-sm text-slate-400">
                    Tambahkan, update, dan hapus project yang tampil di halaman portfolio.
                </p>
            </div>

            <section className="border border-slate-800 rounded-2xl p-4 md:p-6 bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold">
                        {editingId ? 'Edit Project' : 'Tambah Project Baru'}
                    </h2>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-xs px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800"
                        >
                            Batal Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs mb-1">Judul Project</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">
                                Kategori (Personal / Academic / dst)
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Deskripsi Singkat</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500 min-h-[80px]"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs mb-1">URL Project (Visit)</label>
                            <input
                                type="url"
                                value={projectUrl}
                                onChange={e => setProjectUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">URL Repository (Code)</label>
                            <input
                                type="url"
                                value={githubUrl}
                                onChange={e => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Gambar Project</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files?.[0] || null)}
                            className="block w-full text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-100 hover:file:bg-slate-700"
                        />
                        {editingId && (
                            <p className="text-[11px] text-slate-500 mt-1">
                                Kosongkan jika tidak ingin mengubah gambar.
                            </p>
                        )}
                    </div>

                    <TechStackField items={techStack} onChange={setTechStack} />

                    {errorMsg && (
                        <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-60 px-4 py-2 text-sm font-medium"
                    >
                        {saving
                            ? editingId
                                ? 'Menyimpan perubahan...'
                                : 'Menyimpan...'
                            : editingId
                                ? 'Simpan Perubahan'
                                : 'Tambah Project'}
                    </button>
                </form>
            </section>

            <section className="border border-slate-800 rounded-2xl p-4 md:p-6 bg-slate-900/50">
                <h2 className="text-sm font-semibold mb-3">Daftar Project</h2>

                {loading ? (
                    <p className="text-sm text-slate-400">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        Belum ada project. Tambahkan project baru di form di atas.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4"
                            >
                                {project.image_url && (
                                    <div className="w-full md:w-40 h-28 md:h-24 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                        <Image
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-semibold">{project.title}</h3>
                                        {project.category && (
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                                {project.category}
                                            </span>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}

                                    {project.tech_stack && project.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            {project.tech_stack.map((t, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80"
                                                >
                                                    {t.icon_url && (
                                                        <Image
                                                            src={t.icon_url}
                                                            alt={t.name}
                                                            className="w-3.5 h-3.5 object-contain"
                                                        />
                                                    )}
                                                    <span>{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.project_url && (
                                            <a
                                                href={project.project_url}
                                                target="_blank"
                                                className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                                            >
                                                Visit
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                                            >
                                                Code
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 items-end md:items-stretch">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
