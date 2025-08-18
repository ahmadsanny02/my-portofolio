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
            tech_stack: [
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
            ],
            code: "https://github.com/ahmadsanny2/books-marketplace.git",
            visit: "",
        },
        {
            id: 2,
            name_project: "Chatbot",
            image: "/assets/projects/chat-ai.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: [
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
            ],
            code: "https://github.com/ahmadsanny2/chat-ai.git",
            visit: "",
        },
        {
            id: 3,
            name_project: "Landing Page Adiwiyata",
            image: "/assets/projects/adiwiyata.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: [
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
            ],
            code: "https://github.com/fahmiilmawan/adiwiyata.git",
            visit: "https://adiwiyata.smktarpan1.sch.id"
        },
        {
            id: 4,
            name_project: "Kalkulator",
            image: "/assets/projects/kalkulator.png",
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: [
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
            ],
            code: "https://github.com/ahmadsanny2/kalkulator.git",
            visit: "https://ahmadsanny2.github.io/kalkulator"
        },
        {
            id: 5,
            name_project: "Landing Page Saribunga Group",
            image: "/assets/projects/saribunga.png",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: [
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
            ],
            code: "https://github.com/fahmiilmawan/saribunga-landing.git",
            visit: ""
        }
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
                        <h1 className="text-xl font-bold">{projects.name_project.slice(0, 25)}</h1>
                        <div className="text-gray-300 mt-2">
                            <p className="text-justify">
                                {projects.description.length >= characterLimit
                                    ? projects.description.slice(0, characterLimit) + "..."
                                    : projects.description}
                            </p>
                            <div className="flex gap-2 mt-5">
                                {projects.tech_stack.map((tech, index) => (
                                    <div className="bg-white/10 p-2 hover:bg-white transition-all ease-in-out duration-300 rounded-full" key={index}>
                                        <Image src={tech} width={20} height={20} alt="Tech Stack" />
                                    </div>
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
