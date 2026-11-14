import type { Certificate, Project, Skill } from 'types';
import { BOOT_SCRIPT } from '@/components/experience/boot';
import ClassicView from '@/components/experience/ClassicView';
import Experience from '@/components/experience/Experience';
import { fetchPublicList } from '@/lib/server-api';

export default async function Home() {
  // Render portfolio content on the server so crawlers and link previews see it
  const [skills, projects, certificates] = await Promise.all([
    fetchPublicList<Skill>('/skills'),
    fetchPublicList<Project>('/projects'),
    fetchPublicList<Certificate>('/certificates'),
  ]);

  return (
    <>
      {/* Render-blocking on purpose: decides the initial presentation before first paint */}
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <Experience>
        <ClassicView skills={skills} projects={projects} certificates={certificates} />
      </Experience>
    </>
  );
}
