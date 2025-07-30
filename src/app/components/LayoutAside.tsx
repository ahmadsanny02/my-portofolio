import Image from "next/image";
import Profil from "@/../public/assets/profil.png"
import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function Aside() {
    const socialMedia = [
        {
            name: "ahmadsanny02",
            platform: "Instagram",
            icon: <Instagram />,
            link: "https://instagram.com/ahmadsanny02"
        },
        {
            name: "ahmadsanny02",
            platform: "Linkedin",
            icon: <Linkedin />,
            link: "https://linkedin.com/id/ahmadsanny02"
        },
        {
            name: "ahmadsanny2",
            platform: "Github",
            icon: <Github />,
            link: "https://github.com/ahmadsanny02"
        }
    ]
    return (
        <aside className="bg-white/10 p-5 lg:p-10 min-w-fit rounded-2xl">
            <div className="">
                <Image alt="" src={Profil} width="200" height="200" className="flex justify-self-center bg-white/10 p-2 rounded-full" />
                <div className="mt-5">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold">AHMAD SANI JABARULLOH</h1>
                        <p className="bg-white/10 p-2 mt-2 rounded-full">Frontend Web Developer</p>
                    </div>
                    <div className="mt-5">
                        {socialMedia.map((socmed, index) => (
                            <div className="my-3" key={index}>
                                <Link href={socmed.link}>
                                    <div className="flex gap-2 items-center">
                                        <p className="bg-white/10 p-3 rounded-full">
                                            {socmed.icon}
                                        </p>
                                        <div className="">
                                            <p className="">{socmed.platform}</p>
                                            <p className="">{socmed.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </aside>
    )
}