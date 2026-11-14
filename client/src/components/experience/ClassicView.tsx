import dynamic from 'next/dynamic';
import { Github, Instagram, Linkedin } from 'lucide-react';
import type { Certificate, Project, Skill } from 'types';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import { profile } from '@/data/profile';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection'), { ssr: true });
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), { ssr: true });
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), { ssr: true });
const CertificatesSection = dynamic(() => import('@/components/sections/CertificatesSection'), { ssr: true });
const EducationSection = dynamic(() => import('@/components/sections/EducationSection'), { ssr: true });
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), { ssr: true });

const footerLinks = [
  { href: profile.socials.github, label: 'GitHub Profile', Icon: Github },
  { href: profile.socials.linkedin, label: 'LinkedIn Profile', Icon: Linkedin },
  { href: profile.socials.instagram, label: 'Instagram Profile', Icon: Instagram },
];

interface ClassicViewProps {
  /** Server-fetched lists; `undefined` makes the section fetch in the browser instead. */
  skills?: Skill[];
  projects?: Project[];
  certificates?: Certificate[];
}

/**
 * The complete portfolio as a regular, server-rendered page.
 *
 * It serves three roles from one DOM tree: the indexable document, the
 * fallback when WebGL is unavailable or declined, and — in the 3D room — the
 * content of the overlay that opens from the computer.
 */
export default function ClassicView({ skills, projects, certificates }: ClassicViewProps) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection initialSkills={skills} />
      <ProjectsSection initialProjects={projects} />
      <CertificatesSection initialCertificates={certificates} />
      <EducationSection />
      <ContactSection />

      <footer className="py-20 border-t border-secondary/10 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s build something amazing together
          </h2>
          <p className="text-secondary mb-10">
            Currently open for new opportunities and collaborations.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="sm:text-xl md:text-2xl font-bold text-primary hover:underline underline-offset-8 transition-all"
          >
            {profile.email}
          </a>
          <div className="mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm">
              © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              {footerLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
