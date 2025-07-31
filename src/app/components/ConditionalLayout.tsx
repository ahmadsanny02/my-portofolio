// src/app/components/ConditionalLayout.tsx

"use client";

import { usePathname } from "next/navigation";
import Aside from "./Aside";
import Header from "./Header";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        // Biarkan div ini menjadi flex container
        <div className="flex flex-col max-lg:gap-5 lg:flex-row bg-black text-white container mx-auto h-screen gap-10 p-5 rounded-2xl">

            <Aside />
            <div className="bg-white/10 min-lg:flex-1 rounded-2xl flex flex-col"> {/* Tambahkan flex-1 dan flex-col */}

                <Header />

                <main className="overflow-auto p-5 lg:p-10 min-lg:flex-1"> {/* Tambahkan flex-1 agar main content mengisi sisa tinggi */}
                    {children}
                </main>
            </div>
        </div>
    );
}