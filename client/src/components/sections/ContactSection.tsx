'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api-client';
import toast from 'react-hot-toast';

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
    } catch (error) {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">Contact</h2>
            <h3 className="text-4xl font-bold mb-8">Let's Talk About Your Project</h3>
            <p className="text-secondary text-lg mb-10 leading-relaxed">
              I'm always looking for new opportunities and collaborations. 
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Mail size={20} /></div>
                <div>
                  <p className="text-xs text-secondary font-bold uppercase tracking-widest">Email</p>
                  <p className="font-semibold">ahmadsanijabarulloh.02@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-secondary font-bold uppercase tracking-widest">Location</p>
                  <p className="font-semibold">West Bandung, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface p-8 rounded-3xl border border-secondary/5 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell me more about your project..."
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
