"use client"

import { Award, Code, Home, Menu, X } from "lucide-react";
import Link from "next/link"
import React, { useState } from "react"

const LayoutsDashboard = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const [menuOpen, setMenuOpen] = useState(false);

    const link = [
        {
            name: "Dashboard",
            href: "/Dashboard",
            icon: <Home />
        },
        {
            name: "Projects",
            href: "/Dashboard/manage-projects",
            icon: <Code />
        },
        {
            name: "Certificates",
            href: "#",
            icon: <Award />
        }
    ]

    return (
        <div className="bg-white/10 text-white  h-[100vh]">
            <div className="container mx-auto lg:px-20 py-10">

                <button type="button" className="cursor-pointer p-2" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X /> : <Menu />}
                </button>

                <div className="flex flex-row gap-10 mt-5">

                    <div className="">
                        <ul className="flex flex-col gap-2">
                            {link.map((item, i) => {
                                return (
                                    <li className="hover:bg-white/10 p-2 rounded" key={i}>
                                        <div className="flex items-center gap-2">
                                            {item.icon}
                                            <Link href={item.href} className="">
                                                {menuOpen ? null : item.name}
                                            </Link>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutsDashboard