"use client"

import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

export default function TextAside() {
    const links = [
        {
            name: "Instagram",
            href: "https://instagram.com/ahmadsanny02",
            icon: <Instagram />
        },
        {
            name: "Linkedin",
            href: "https://linkedin.com/id/ahmadsanny02",
            icon: <Linkedin />
        },
        {
            name: "Github",
            href: "https://github.com/ahmadsanny2",
            icon: <Github />
        }
    ]
    return (
        <div className="">
            <h3 className="text-lg">Hi,</h3>
            <h1 className="text-4xl font-bold">
                I'am, <TypeAnimation
                    sequence={[
                        'AHMAD SANI JABARULLOH',
                        1000,
                        '',
                        200 // Jeda setelah selesai mengetik (ms)
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity} // Mengulang tanpa henti
                />
            </h1>
            <h2 className="text-2xl font-semibold">Frontend Web Developer</h2>
            <div className="flex gap-3 mt-2">
                {links.map((link, index) => (
                    <div className="" key={index}>
                        <Link href={link.href} className="">
                            <p className="bg-white/10 hover:bg-white hover:text-black transition-all duration-300 ease-in-out p-2 rounded-full">
                                {link.icon}
                            </p>
                        </Link>
                    </div>
                ))}


            </div>
        </div>
    )
}