import Link from "next/link"
import React from "react"

const LayoutsDashboard = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const link = [
        {
            name: "Dashboard",
            href: "#"
        },
        {
            name: "Projects",
            href: "#"
        },
        {
            name: "Certificates",
            href: "#"
        }
    ]

    return (
        <div className="flex flex-row text-white px-20 py-10">
            <div className="">
                <ul className="flex flex-col">
                    {link.map((item, i) => {
                        return (
                            <li className="" key={i}>
                                <Link href={item.href}>{item.name}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    )
}

export default LayoutsDashboard