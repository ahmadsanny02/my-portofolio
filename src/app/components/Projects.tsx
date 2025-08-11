import Image from "next/image";
import { Code, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Project {
    id: number
    image: string,
    name_project: string,
    description: string,
    tech_stack: string[],
    code: string
    visit: string
}

export default function CardProjects() {
    const characterLimit = 50;

    const Projects = [
        {
            id: 1,
            name_project: "Books Marketplace",
            image: "/assets/projects/books-marketplace.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["Next JS", "Tailwind CSS"],
            code: "https://github.com/ahmadsanny2/books-marketplace.git",
            visit: "",
        },
        {
            id: 2,
            name_project: "Chatbot",
            image: "/assets/projects/chat-ai.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["Next JS", "Tailwind CSS", "Supabase"],
            code: "https://github.com/ahmadsanny2/chat-ai.git",
            visit: "",
        },
        {
            id: 3,
            name_project: "Landing Page Adiwiyata",
            image: "/assets/projects/adiwiyata.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["HTML", "Tailwind CSS"],
            code: "https://github.com/fahmiilmawan/adiwiyata.git",
            visit: "https://adiwiyata.smktarpan1.sch.id"
        },
        {
            id: 4,
            name_project: "Kalkulator",
            image: "/assets/projects/kalkulator.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["HTML", "CSS", "Javascript"],
            code: "https://github.com/ahmadsanny2/kalkulator.git",
            visit: "https://ahmadsanny2.github.io/kalkulator"
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {Projects.map((projects: Project) => (
                <div
                    className="bg-white/10 border-2 border-transparent group hover:border-white transition-all duration-300 rounded-2xl"
                    key={projects.id}
                >
                    <Image
                        src={projects.image}
                        alt=""
                        priority
                        width="720"
                        height="1600"
                        className="w-full h-52 group-hover:saturate-0 rounded-t-2xl"
                    />
                    <div className="p-5">
                        <h1 className="text-xl font-bold">{projects.name_project}</h1>
                        <div className="text-gray-300 mt-2">
                            <p className="text-justify">
                                {projects.description.length >= characterLimit
                                    ? projects.description.slice(0, characterLimit) + "..."
                                    : projects.description}
                            </p>
                            <div className="flex gap-2 mt-5">
                                {projects.tech_stack.map((tech, index) => (
                                    <p
                                        className="bg-white/10 p-2 text-xs rounded-full"
                                        key={index}
                                    >
                                        {tech}
                                    </p>
                                ))}
                            </div>
                            <div className="flex gap-5 justify-end mt-5">
                                <Link href={projects.code}>
                                    <div className="flex gap-2">
                                        <Code />
                                        <p className="">Code</p>
                                    </div>
                                </Link>
                                <Link href={projects.visit}>
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
