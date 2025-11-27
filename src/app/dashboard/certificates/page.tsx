// app/dashboard/certificates/page.tsx
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import { Certificate } from 'types';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

export default function DashboardCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [issuer, setIssuer] = useState('');
    const [category, setCategory] = useState('');
    const [certificateUrl, setCertificateUrl] = useState('');
    const [earnedAt, setEarnedAt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setIssuer('');
        setCategory('');
        setCertificateUrl('');
        setEarnedAt('');
        setImageFile(null);
    };

    const fetchCertificates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setCertificates((data || []) as Certificate[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const uploadImageIfNeeded = async (file: File | null, existingUrl?: string | null) => {
        if (!file) return existingUrl || null;

        const ext = file.name.split('.').pop();
        const fileName = `certificates/${Date.now()}.${ext}`;

        const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true
        })

        const { data, error } = await supabase.storage
            .from('certificate-images')
            .upload(fileName, compressed);

        if (error) {
            throw error;
        }

        const { data: publicData } = supabase.storage
            .from('certificate-images')
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
                const current = certificates.find(c => c.id === editingId);
                imageUrl = await uploadImageIfNeeded(imageFile, current?.image_url || null);

                const { error } = await supabase
                    .from('certificates')
                    .update({
                        title,
                        issuer,
                        category,
                        certificate_url: certificateUrl || null,
                        earned_at: earnedAt || null,
                        image_url: imageUrl,
                    })
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                imageUrl = await uploadImageIfNeeded(imageFile, null);

                const { error } = await supabase.from('certificates').insert({
                    title,
                    issuer,
                    category,
                    certificate_url: certificateUrl || null,
                    earned_at: earnedAt || null,
                    image_url: imageUrl,
                });

                if (error) throw error;
            }

            await fetchCertificates();
            resetForm();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setErrorMsg(err.message || 'Gagal menyimpan certificate');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (certificate: Certificate) => {
        setEditingId(certificate.id);
        setTitle(certificate.title);
        setIssuer(certificate.issuer ?? '');
        setCategory(certificate.category ?? '');
        setCertificateUrl(certificate.certificate_url ?? '');
        setEarnedAt(certificate.earned_at ?? '');
        setImageFile(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus certificate ini?')) return;

        const { error } = await supabase.from('certificates').delete().eq('id', id);
        if (error) {
            setErrorMsg(error.message);
            return;
        }
        setCertificates(prev => prev.filter(c => c.id !== id));
        if (editingId === id) resetForm();
    };

    return (
        <div className="">
            <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-2">Certificates</h1>
                <p className="text-sm text-slate-400">
                    Kelola certificate yang tampil di halaman utama portofolio kamu.
                </p>
            </div>

            <section className="border border-slate-800 rounded-2xl p-4 md:p-6 bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold">
                        {editingId ? 'Edit Certificate' : 'Tambah Certificate Baru'}
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
                            <label className="block text-xs mb-1">Judul Certificate</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Issuer / Penyelenggara</label>
                            <input
                                type="text"
                                value={issuer}
                                onChange={e => setIssuer(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs mb-1">Kategori</label>
                            <input
                                type="text"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                placeholder="Programming / AI / Competition / dst"
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Tanggal Didapat (opsional)</label>
                            <input
                                type="date"
                                value={earnedAt}
                                onChange={e => setEarnedAt(e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">URL Certificate (opsional)</label>
                        <input
                            type="url"
                            value={certificateUrl}
                            onChange={e => setCertificateUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Gambar Certificate</label>
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
                                : 'Tambah Certificate'}
                    </button>
                </form>
            </section>

            <section className="border border-slate-800 rounded-2xl p-4 md:p-6 bg-slate-900/50">
                <h2 className="text-sm font-semibold mb-3">Daftar Certificates</h2>

                {loading ? (
                    <p className="text-sm text-slate-400">Loading certificates...</p>
                ) : certificates.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        Belum ada certificate. Tambahkan certificate baru di form di atas.
                    </p>
                ) : (
                    <div className="flex flex-col justify-self-center lg:grid lg:grid-cols-2 2xl:grid-cols-4 gap-3 md:gap-4">
                        {certificates.map(c => (
                            <div
                                key={c.id}
                                className="border border-slate-800 rounded-xl p-3 md:p-4 bg-slate-950/40 w-96"
                            >
                                {c.image_url && (
                                    <div className="rounded-lg overflow-hidden bg-slate-800">
                                        <Image
                                            src={c.image_url}
                                            alt={c.title}
                                            width={1600}
                                            height={720}
                                            className="w-full h-56 object-cover"
                                        />
                                    </div>
                                )}
                                <div className="my-2">
                                    <div className="flex justify-between gap-1 text-xs text-slate-400">
                                        {c.issuer && <p>{c.issuer}</p>}
                                        {c.earned_at && <p>{c.earned_at}</p>}
                                    </div>
                                    <h3 className="text-md font-semibold">{c.title}</h3>
                                    {c.certificate_url && (
                                        <a
                                            href={c.certificate_url}
                                            target="_blank"
                                            className="inline-flex mt-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                                        >
                                            Lihat Certificate
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleEdit(c)}
                                        className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
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
