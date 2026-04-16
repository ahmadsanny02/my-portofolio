// app/components/dashboard/TechStackField.tsx
'use client';

import { TechStackItem } from 'types';

type Props = {
    items: TechStackItem[];
    onChange: (items: TechStackItem[]) => void;
};

export function TechStackField({ items, onChange }: Props) {
    const updateItem = (idx: number, key: keyof TechStackItem, value: string) => {
        const next = [...items];
        next[idx] = { ...next[idx], [key]: value };
        onChange(next);
    };

    const addItem = () => {
        onChange([...items, { name: '', icon_url: '' }]);
    };

    const removeItem = (idx: number) => {
        const next = items.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tech Stack</span>
                <button
                    type="button"
                    onClick={addItem}
                    className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                >
                    + Add Tech
                </button>
            </div>
            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-xs text-slate-500">
                        Belum ada tech stack. Klik &quot;+ Add Tech&quot;.
                    </p>
                )}
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_auto] gap-2 items-center"
                    >
                        <input
                            type="text"
                            placeholder="Nama (misal: Next.js)"
                            value={item.name}
                            onChange={e => updateItem(idx, 'name', e.target.value)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring focus:ring-sky-500"
                        />
                        <input
                            type="text"
                            placeholder="Icon URL (misal: https://...)"
                            value={item.icon_url}
                            onChange={e => updateItem(idx, 'icon_url', e.target.value)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring focus:ring-sky-500"
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-xs px-3 py-2 rounded-lg bg-red-700/80 hover:bg-red-600"
                        >
                            Hapus
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
