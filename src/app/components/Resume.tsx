interface Education {
    id: number,
    name: string,
    jurusan: string,
    date: string,
    tasks: string[]
}

interface Experience {
    id: number,
    name: string,
    position: string,
    date: string,
    tasks: string[]
}
export default function Resume() {
    const dataEducation = [
        {
            id: 1,
            name: "SMK Taruna Harapan 1 Cipatat",
            jurusan: "Software Engineering",
            date: "Jul 2023 - Jul 2026",
            tasks: [
                "Delving into the field of web programming and database management as part of the Software Engineering major.",
                "Actively developing application projects such as the Adiwiyata Landing Page Website. Achieved the highest grade in web programming.",
                "Participated in a national Web Design competition (INVOFEST 2024) as team leader and Front-End Developer.",
                "Active as the head of the Tarpan Tech extracurricular club and participated in various additional training courses from Dicoding and Codepolitan, with a focus on web application development."
            ]
        }
    ]

    const dataWorkExperience = [
        {
            id: 1,
            name: "PT Sampul Kreatif Teknologi",
            position: "Web Developer | Internship",
            date: "Apr 2025 - Jul 2025",
            tasks: [
                "Developing a website-based chatbot application with Next.js and OpenAI API integration.",
                "Developing a web-based book marketplace platform with Tailwind CSS, Supabase, and Git.",
                "Completing all features and fixing bugs that arose during the development process.",
                "Result: The application was successfully deployed using Vercel and was utilized as an internal company demonstration medium.",
                "Final Evaluation: Discipline (95), Work Ability (90), Work Quality (85) — Rating: Excellent."
            ]
        },
        {
            id: 2,
            name: "Saribunga Group",
            position: "Front-End Developer | Freelance",
            date: "Jun 2025 - Jul 2025",
            tasks: [
                "I designed and built a company landing page using React.js, Tailwind CSS, and Laravel (Inertia.js).",
                "I set up dynamic navigation with React Router and managed the project code using Git.",
                "I optimized display performance with modular UI components.",
                "As a result, the landing page was successfully launched and is now used as the company's main digital branding tool."
            ]
        },
        {
            id: 3,
            name: "SMK Taruna Harapan 1 Cipatat",
            position: "Front-End Developer | Project Based",
            date: "Nov 2024 - Dec 2024",
            tasks: [
                "Developing the Adiwiyata website as a medium for publishing school environmental activities and programs.",
                "Implementing the interface using HTML, CSS, JavaScript, Tailwind CSS, and Laravel.",
                "Converting the design from Figma into a clean and responsive user interface.",
                "Result: The website is used to document the school's Adiwiyata activities during the accreditation process."
            ]
        }
    ]

    return (
        <div className="">
            <div className="my-5">
                <h1 className="font-bold text-2xl">EDUCATION</h1>
                <div className="border-t-2 border-t-white">
                    <div className="">
                        {dataEducation.map((education: Education) => (
                            <div className="my-2" key={education.id}>
                                <div className="lg:flex justify-between font-bold items-center">
                                    <p className="">{education.jurusan}</p>
                                    <p className="">{education.date}</p>
                                </div>
                                <p className="font-bold">{education.name}</p>
                                <ul className="list-disc ms-10">
                                    {education.tasks.map((task, index) => (
                                        <li className="" key={index}>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            <div className="my-5">
                <h1 className="font-bold text-2xl">WORK EXPERIENCE</h1>
                <div className="border-t-2 border-t-white">
                    <div className="">
                        {dataWorkExperience.map((experience: Experience) => (
                            <div className="my-2" key={experience.id}>
                                <div className="lg:flex justify-between font-bold items-center">
                                    <p className="">{experience.position}</p>
                                    <p className="">{experience.date}</p>
                                </div>
                                <p className="font-bold">{experience.name}</p>
                                <ul className="list-disc ms-10">
                                    {experience.tasks.map((task, index) => (
                                        <li className="" key={index}>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}