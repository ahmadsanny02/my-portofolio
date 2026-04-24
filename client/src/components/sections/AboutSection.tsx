'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
    return (
        <section id="about" className="py-24">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-primary/10 rounded-3xl overflow-hidden relative group">
                            <Image
                                src="/profile/profile.png"
                                alt="Ahmad Sani Jabarulloh"
                                fill
                                className="object-cover transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-3xl shadow-xl border border-secondary/10">
                            <p className="text-3xl font-bold text-primary">2+</p>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                                Years Pro-Exp
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0}}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: false, amount: 0.2 }}>
                        <h2 className="text-primary font-bold tracking-widest mb-2 uppercase text-sm">
                            About Me
                        </h2>
                        <h3 className="text-4xl font-bold mb-6">
                            Passionate Frontend Developer Based in West Bandung
                        </h3>
                        <p className="text-secondary text-lg leading-relaxed mb-8 font-medium">
                            I am a dedicated Frontend Developer with a focus on the modern
                            JavaScript ecosystem. With expertise in building responsive,
                            interactive, and high-performance web applications using React.js
                            and Next.js, I am passionate about learning new technologies and
                            always strive to implement best practices in every project I
                            undertake.
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
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
