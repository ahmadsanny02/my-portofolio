// types/index.ts
export type TechStackItem = {
    name: string;
    icon_url: string;
};

export type Project = {
    id: string;
    title: string;
    category: string | null;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    github_url: string | null;
    tech_stack: TechStackItem[] | null;
    created_at: string;
};

export type Certificate = {
    id: string;
    title: string;
    issuer: string | null;
    category: string | null;
    image_url: string | null;
    certificate_url: string | null;
    earned_at: string | null;
    created_at: string;
};
