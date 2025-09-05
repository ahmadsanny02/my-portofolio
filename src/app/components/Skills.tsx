import { Code } from "lucide-react";
import Image from "next/image";

interface Skills {
    id: number,
    nameSkill: string,
    image: string
}

export default function Skills() {
    const dataSkills = [
        {
            id: 1,
            nameSkill: "HTML",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        },
        {
            id: 2,
            nameSkill: "CSS",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
        },
        {
            id: 3,
            nameSkill: "JavaScript",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"

        },
        {
            id: 4,
            nameSkill: "PHP",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"
        },
        {
            id: 5,
            nameSkill: "React JS",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
        },
        {
            id: 6,
            nameSkill: "Next JS",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
        },
        {
            id: 7,
            nameSkill: "Tailwind CSS",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
        },
        {
            id: 8,
            nameSkill: "Laravel",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"
        },
        {
            id: 9,
            nameSkill: "Bootstrap",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg"
        },
        {
            id: 10,
            nameSkill: "Supabase",
            image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
        }
    ]

    return (
        <div className="mt-10">
            <div className="flex items-center gap-1 font-semibold">
                <Code />
                <h1 className="text-2xl font-semibold">My Skills</h1>
            </div>
            <div className="flex max-md:justify-center flex-wrap gap-5 mt-5">

                {dataSkills.map((skills: Skills) => (
                    <div className="bg-white/10 group p-2 rounded" key={skills.id}>
                        <div className="group-hover:flex group-hover:items-center group-hover:gap-2">
                            <Image src={skills.image} width={40} height={40} className="flex justify-self-center" alt="Skill" />
                            <p className="font-semibold hidden group-hover:block transition-all ease-in-out duration-500">{skills.nameSkill}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}