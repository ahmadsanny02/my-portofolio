'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Send, Mail, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';

const infoContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const infoItemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

const formVariants: Variants = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 75,
      damping: 15
    }
  }
};

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info Details Column */}
          <motion.div
            variants={infoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 
              variants={infoItemVariants}
              className="text-primary font-bold tracking-widest mb-2 uppercase text-sm"
            >
              Contact
            </motion.h2>
            <motion.h3 
              variants={infoItemVariants}
              className="text-4xl font-extrabold mb-8 text-foreground"
            >
              Let&apos;s Talk About Your Project
            </motion.h3>
            <motion.p 
              variants={infoItemVariants}
              className="text-secondary text-lg mb-10 leading-relaxed font-medium"
            >
              I&apos;m always looking for new opportunities and collaborations. 
              Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </motion.p>

            <motion.div variants={infoItemVariants} className="space-y-6">
              {[
                { label: "Email", val: "ahmadsanijabarulloh.02@gmail.com", Icon: Mail },
                { label: "Location", val: "West Bandung, Indonesia", Icon: MapPin },
              ].map(({ label, val, Icon }, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/5 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-secondary font-extrabold uppercase tracking-widest">{label}</p>
                    <p className="text-sm sm:text-base font-bold text-foreground">{val}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Form Card Column */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="bg-surface/50 dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-[32px] border border-secondary/10 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/35 text-sm font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/35 text-sm font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-background/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-secondary/35 text-sm font-medium"
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background/50 border border-secondary/20 dark:border-white/10 rounded-2xl px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-sm font-medium placeholder:text-secondary/35"
                  placeholder="Tell me more about your project..."
                />
              </div>
              <motion.button
                disabled={loading}
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
