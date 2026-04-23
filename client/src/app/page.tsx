import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import ContactSection from '@/components/sections/ContactSection';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-primary/10 rounded-3xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                  alt="Ahmad Sani Jabarulloh" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-3xl shadow-xl border border-secondary/10">
                <p className="text-3xl font-bold text-primary">2+</p>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Years Pro-Exp</p>
              </div>
            </div>
            <div>
              <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Passionate Frontend Developer Based in Bandung</h3>
              <p className="text-secondary text-lg leading-relaxed mb-8">
                Saya adalah seorang Frontend Developer yang berfokus pada ekosistem JavaScript modern. 
                Berpengalaman dalam membangun aplikasi web yang responsif, interaktif, dan berperforma tinggi 
                menggunakan React.js dan Next.js. Saya senang belajar teknologi baru dan selalu berusaha 
                menerapkan best practices dalam setiap proyek yang saya kerjakan.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-1">Modern Stack</h4>
                  <p className="text-secondary text-sm">Next.js & Tailwind CSS</p>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-secondary text-sm">West Bandung, ID</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkillsSection />
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection />

      <footer className="py-20 border-t border-secondary/10 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's build something amazing together</h2>
          <p className="text-secondary mb-10">Currently open for new opportunities and collaborations.</p>
          <a href="mailto:ahmadsanijabarulloh.02@gmail.com" className="text-2xl font-bold text-primary hover:underline underline-offset-8 transition-all">
            ahmadsanijabarulloh.02@gmail.com
          </a>
          <div className="mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm">© 2026 Ahmad Sani Jabarulloh. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://github.com/ahmadsanny2" target="_blank" className="p-2 bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"><Github size={18} /></a>
              <a href="https://linkedin.com/in/ahmadsanny02" target="_blank" className="p-2 bg-background rounded-lg hover:text-primary transition-all border border-secondary/5"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
