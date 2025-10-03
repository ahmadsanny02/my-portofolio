"use client";
import { Code, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

// ————————————————————————————————
// Next.js Tabs (App Router compatible) untuk proyek
// Tab 1: Semua item; Tab 2..n: filter by category (bertindak seperti ID)
// ————————————————————————————————

export type Project = {
    id: number;
    name_project: string;
    image: string; // local /public path (mis: "/assets/projects/..")
    description: string;
    tech_stack: string[]; // CDN icon URLs
    code: string; // repo URL
    visit: string; // live URL (boleh kosong)
    category: "programming" | "ai" | "competition" | "internship" | string;
};

const characterLimit = 50;

const PROJECT: Project[] = [
    {
        id: 1,
        name_project: "Books Marketplace",
        image: "/assets/projects/books-marketplace.png",
        description:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus...",
        tech_stack: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
        ],
        code: "https://github.com/ahmadsanny2/books-marketplace.git",
        visit: "https://books-marketplace-sable.vercel.app/",
        category: "internship",
    },
    {
        id: 2,
        name_project: "Chatbot",
        image: "/assets/projects/chat-ai.png",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia dicta ratione...",
        tech_stack: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
        ],
        code: "https://github.com/ahmadsanny2/chat-ai.git",
        visit: "https://chat-ai-five-bice.vercel.app/",
        category: "internship",
    },
    {
        id: 3,
        name_project: "Landing Page Adiwiyata",
        image: "/assets/projects/adiwiyata.png",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae similique...",
        tech_stack: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
        ],
        code: "https://github.com/fahmiilmawan/adiwiyata.git",
        visit: "https://adiwiyata.smktarpan1.sch.id",
        category: "collaboration",
    },
    {
        id: 4,
        name_project: "Kalkulator",
        image: "/assets/projects/kalkulator.png",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae similique...",
        tech_stack: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        ],
        code: "https://github.com/ahmadsanny2/kalkulator.git",
        visit: "https://ahmadsanny2.github.io/kalkulator",
        category: "personal projects",
    },
    {
        id: 5,
        name_project: "Landing Page Saribunga Group",
        image: "/assets/projects/saribunga.png",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae similique...",
        tech_stack: [
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
        ],
        code: "https://github.com/fahmiilmawan/saribunga-landing.git",
        visit: "",
        category: "collaboration",
    },
];

const TABS: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "personal projects", label: "Personal Projects" },
    { key: "academic projects", label: "Academic Projects" },
    { key: "collaboration", label: "Collaborations" },
    { key: "internship", label: "Internship" },
    { key: "competition", label: "Competition" },
];

export default function ProjectsComponent({ items = PROJECT }: { items?: Project[] }) {
    const [activeTab, setActiveTab] = useState<string>(TABS[0].key);

    const filtered = useMemo(() => {
        if (activeTab === "all") return items;
        return items.filter((it) => String(it.category) === activeTab);
    }, [items, activeTab]);

    return (
        <div className="">
            <p className="my-5">
                Here are some projects I have worked on as evidence of my skills and experience in web development.
            </p>
            {/* Tabs */}
            <div className="flex snap-mandatory overflow-auto">
                <div className="flex shrink-0 gap-5">
                    <div role="tablist" aria-label="Kategori Proyek" className="flex gap-2 rounded-2xl p-1">
                        {TABS.map((t) => {
                            const selected = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    id={`tab-${t.key}`}
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`panel-${t.key}`}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`cursor-pointer px-7 py-1 rounded-full transition hover:bg-blue-500 hover:text-white ${selected ? "bg-blue-500 text-white" : "bg-white/10"
                                        }`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Panel */}
            <section
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
                {filtered.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
                        Tidak ada proyek pada kategori ini.
                    </div>
                ) : (
                    filtered.map((p) => <ProjectCard key={p.id} project={p} />)
                )}
            </section>
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="group rounded-2xl border-2 border-transparent bg-white/10 transition-all duration-300 hover:border-white">
            <Image
                src={project.image}
                alt={project.name_project}
                priority
                width={720}
                height={400}
                className="h-52 w-full rounded-t-2xl object-cover group-hover:saturate-0"
            />
            <div className="p-5 text-gray-300">
                <h2 className="text-xl font-bold">{project.name_project.slice(0, 25)}</h2>
                <p className="mt-2 text-justify">
                    {project.description.length > characterLimit
                        ? project.description.slice(0, characterLimit) + "..."
                        : project.description}
                </p>

                <div className="mt-3 flex gap-2">
                    {project.tech_stack.map((tech, index) => (
                        <div
                            className="rounded-full bg-white/10 p-2 transition-all duration-300 ease-in-out hover:bg-white"
                            key={index}
                        >
                            {/* Icon dari CDN: gunakan unoptimized agar tidak perlu edit next.config */}
                            <Image src={tech} width={20} height={20} alt="Tech Stack" unoptimized />
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end gap-5">
                    {project.code && (
                        <Link href={project.code} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Code />
                            <span>Code</span>
                        </Link>
                    )}
                    {project.visit && (
                        <Link href={project.visit} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <ExternalLink />
                            <span>Visit</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}