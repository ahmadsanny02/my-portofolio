import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import { Github, Linkedin, Twitter } from 'lucide-react';
import AboutSection from '@/components/sections/AboutSection';

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
            Let's build something amazing together
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
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
