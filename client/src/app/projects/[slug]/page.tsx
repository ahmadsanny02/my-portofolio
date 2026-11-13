import React from 'react';
import { Metadata } from 'next';
import ProjectContent from '@/components/project/ProjectContent';
import { notFound } from 'next/navigation';
import { fetchProjectBySlug } from '@/lib/server-api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectContent project={project} />;
}
