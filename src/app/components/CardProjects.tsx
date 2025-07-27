import Image from "next/image";
import BooksMarketplace from "@/../public/assets/books-marketplace.png"
import { Code, ExternalLink } from "lucide-react";
import Link from "next/link";

// Fungsi untuk mengambil data dari API kita
async function getProjects() {
    // Fetch data di sisi server
    // Opsi { cache: 'no-store' } digunakan agar data selalu baru setiap kali halaman di-request
    const res = await fetch('http://localhost:3000/api/projects', { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Gagal mengambil data produk');
    }

    return res.json();
}

export default async function CardProjects() {
    const { data: projects } = await getProjects();
    const characterLimit = 50

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {projects.map((projects, index) => (
                <div className="bg-white/10 border-2 border-transparent group hover:border-white transition-all duration-300 rounded-2xl" key={index}>
                    <Image src={projects.image} alt="" width={0} height={0} className="w-full h-52 group-hover:saturate-0 rounded-t-2xl" />
                    <div className="p-5">
                        <h1 className="text-xl font-bold">{projects.name_project}</h1>
                        <div className="text-gray-300 mt-2">
                            <p className="text-justify">{projects.description.length >= characterLimit ? projects.description.slice(0, characterLimit) + "..." : projects.description}</p>
                            <div className="flex gap-2 mt-5">
                                {projects.tech_stack.map((tech, index) => (
                                    <p className="bg-white/10 p-2 text-xs rounded-full" key={index}>{tech}</p>
                                ))}
                            </div>
                            <div className="flex gap-5 justify-end mt-5">
                                <Link href={projects.code}>
                                    <div className="flex gap-2">
                                        <Code />
                                        <p className="">Code</p>
                                    </div>
                                </Link>
                                <Link href="">
                                    <div className="flex gap-2">
                                        <ExternalLink />
                                        <p className="">Visit</p>
                                    </div>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}