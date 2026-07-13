import React from 'react';
import { Metadata } from 'next';
import type { Project, ApiResponse } from 'types';
import ProjectContent from '@/components/project/ProjectContent';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    const data: ApiResponse<Project> = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) return { title: 'Project Not Found' };
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      images: [project.thumbnail || ''],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectContent project={project} />;
}
