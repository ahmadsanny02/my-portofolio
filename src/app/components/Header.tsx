import { AppWindow, FileText, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname()

    const navLinks = [
        { name: "Home", href: "/", icon: <House /> },
        { name: "Projects", href: "/projects", icon: <AppWindow /> },
        { name: "Download CV", href: "/assets/cv/CV_Ahmad_Sani_Jabarulloh_Frontend_Developer.pdf", icon: <FileText /> },
    ]

    return (
        <header className="max-lg:fixed max-lg:bottom-5 max-lg:left-0 max-lg:rounded w-full">
            <div className="">
                <nav className="flex lg:justify-between justify-center items-center">
                    <h1 className="text-2xl hidden lg:block font-semibold ps-5">
                        My Portofolio
                    </h1>
                    <ul className="flex gap-5 bg-white/10 p-5 rounded-bl-2xl rounded-tr-2xl max-lg:rounded-2xl">
                        {navLinks.map((link, index) => (
                            <li className="" key={index}>
                                <Link href={link.href} className={`hover:text-blue-500 transition-all duration-300 ease-in-out ${pathname == link.href ? "text-blue-500 text-shadow-white" : ""}`}>
                                    <div className="flex gap-2 items-center">
                                        {link.icon}
                                        <p className="">{link.name}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}

                    </ul>
                </nav>
            </div>
        </header>
    )
}