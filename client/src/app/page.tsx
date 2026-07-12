import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import { Github, Instagram, Linkedin } from 'lucide-react';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection'), { ssr: true });
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), { ssr: true });
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), { ssr: true });
const CertificatesSection = dynamic(() => import('@/components/sections/CertificatesSection'), { ssr: true });
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), { ssr: true });


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificatesSection />
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
            href="mailto:ahmadsanijabarulloh.02@gmail.com"
            className="sm:text-xl md:text-2xl font-bold text-primary hover:underline underline-offset-8 transition-all"
          >
            ahmadsanijabarulloh.02@gmail.com
          </a>
          <div className="mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm">
              © 2026 Ahmad Sani Jabarulloh. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/ahmadsanny2"
                target="_blank"
                className="p-2 bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/ahmadsanny02"
                target="_blank"
                className="p-2 bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://instagram.com/ahmadsanny02"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
