"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "lib/supabaseClient";
import { Code, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const characterLimit = 50;

// Tipe Project sesuai data dashboard
type Tech = {
    name: string;
    icon_url: string | null;
};

type Project = {
    id: string;
    title?: string | null;
    description?: string | null;
    category?: string | null;
    image_url?: string | null;
    tech_stack?: Tech[] | null;
    github_url?: string | null;
    project_url?: string | null;
    created_at?: string;
};

export default function ProjectsComponent() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [dataProjects, setDataProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.log("Supabase Error:", error);
                setDataProjects([]);
            } else {
                const projects = data || [];
                setDataProjects(projects);

                // Ambil kategori unik dari data proyek
                const uniqueCategories = Array.from(
                    new Set(projects.map((p) => p.category).filter(Boolean))
                );
                setCategories(uniqueCategories);
            }

            setLoading(false);
        };

        fetchProjects();
    }, []);

    // Filter projects berdasarkan kategori tab
    const filtered = useMemo(() => {
        if (activeTab === "all") return dataProjects;
        return dataProjects.filter((p) => p.category === activeTab);
    }, [dataProjects, activeTab]);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500">Loading projects...</div>
        );
    }

    return (
        <div>
            <p className="my-5">
                Here are some projects I have worked on as evidence of my skills and
                experience in web development.
            </p>

            {/* Tabs */}
            <div className="flex snap-mandatory overflow-auto">
                <div className="flex shrink-0 gap-5">
                    <div
                        role="tablist"
                        aria-label="Kategori Proyek"
                        className="flex gap-2 rounded-2xl p-1"
                    >
                        {/* Tab "All" */}
                        <button
                            key="all"
                            id="tab-all"
                            role="tab"
                            aria-selected={activeTab === "all"}
                            aria-controls="panel-all"
                            onClick={() => setActiveTab("all")}
                            className={`cursor-pointer px-7 py-1 rounded-full transition hover:bg-blue-500 hover:text-white ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-white/10"
                                }`}
                        >
                            All
                        </button>

                        {/* Tabs kategori */}
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                id={`tab-${cat}`}
                                role="tab"
                                aria-selected={activeTab === cat}
                                aria-controls={`panel-${cat}`}
                                onClick={() => setActiveTab(cat)}
                                className={`cursor-pointer px-7 py-1 rounded-full transition hover:bg-blue-500 hover:text-white ${activeTab === cat ? "bg-blue-500 text-white" : "bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
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

// Komponen Project Card
function ProjectCard({ project }: { project: Project }) {
    const name = project.title || "Untitled Project";
    const desc = project.description || "No description available";
    const techStack = project.tech_stack || [];
    const imgSrc = project.image_url || "/placeholder.png";
    const placeholderTech = "/placeholder-tech.png";

    return (
        <div className="group rounded-2xl border-2 border-transparent bg-white/10 transition-all duration-300 hover:border-white">
            {/* Project Image */}
            <Image
                src={imgSrc}
                alt={name}
                priority
                width={720}
                height={400}
                className="h-52 w-full rounded-t-2xl object-fill group-hover:saturate-0"
                unoptimized // untuk local image dan supabase image tanpa loader config
            />

            <div className="p-5 text-gray-300">
                {/* Project Name */}
                <h2 className="text-xl font-bold">{name.slice(0, 25)}</h2>

                {/* Project Description */}
                <p className="mt-2 text-justify">
                    {desc.length > characterLimit ? desc.slice(0, characterLimit) + "..." : desc}
                </p>

                {/* Tech Stack */}
                <div className="mt-3 flex gap-2 flex-wrap">
                    {techStack.length === 0 && (
                        <span className="text-sm text-gray-500">
                            Belum ada tech stack. Klik "+ Add Tech".
                        </span>
                    )}
                    {techStack.map((tech, index) =>
                        tech.icon_url ? (
                            <div
                                className="rounded-full bg-white/10 p-2 transition-all duration-300 ease-in-out hover:bg-white"
                                key={index}
                                title={tech.name}
                            >
                                <Image
                                    src={tech.icon_url}
                                    width={20}
                                    height={20}
                                    alt={tech.name}
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div
                                className="rounded-full bg-white/10 p-2 transition-all duration-300 ease-in-out hover:bg-white"
                                key={index}
                            >
                                <Image
                                    src={placeholderTech}
                                    width={20}
                                    height={20}
                                    alt="Tech Stack"
                                    unoptimized
                                />
                            </div>
                        )
                    )}
                </div>

                {/* Links: Code & Visit */}
                <div className="mt-10 flex justify-end gap-5">
                    {project.github_url && (
                        <Link
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <Code />
                            <span>Code</span>
                        </Link>
                    )}
                    {project.project_url && (
                        <Link
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <ExternalLink />
                            <span>Visit</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
