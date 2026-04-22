import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* About Section Placeholder */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-primary/10 rounded-3xl overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x600" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-3xl shadow-xl border border-secondary/10">
                <p className="text-3xl font-bold text-primary">5+</p>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Years Experience</p>
              </div>
            </div>
            <div>
              <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Designing with Purpose, Developing with Precision</h3>
              <p className="text-secondary text-lg leading-relaxed mb-8">
                I am a passionate software engineer dedicated to building high-quality digital solutions. 
                With a strong foundation in both frontend and backend development, I enjoy solving complex 
                problems and turning ideas into functional, beautiful realities.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-1">Architecture</h4>
                  <p className="text-secondary text-sm">Clean & Scalable</p>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Performance</h4>
                  <p className="text-secondary text-sm">Optimized & Fast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SkillsSection />
      <ProjectsSection />

      {/* Footer Placeholder */}
      <footer id="contact" className="py-20 border-t border-secondary/10 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's build something amazing together</h2>
          <p className="text-secondary mb-10">Currently open for new opportunities and collaborations.</p>
          <a href="mailto:hello@example.com" className="text-2xl font-bold text-primary hover:underline underline-offset-8 transition-all">
            hello@example.com
          </a>
          <div className="mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm">© 2026 Portfolio. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
