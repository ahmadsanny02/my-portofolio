import { NextResponse } from 'next/server';

export async function GET(request) {
    // Ini adalah data dummy Anda
    const dummyProjects = [
        {
            id: 1,
            name_project: "Books Marketplace",
            image: "/assets/books-marketplace.png",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["Next JS", "Tailwind CSS"],
            code: "https://github.com/ahmadsanny2/books-marketplace.git",
            visit: ""
        },
        {
            id: 2,
            name_project: "Chatbot",
            image: "/assets/chat-ai.png",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["Next JS", "Tailwind CSS", "Supabase"],
            code: "https://github.com/ahmadsanny2/chat-ai.git",
            visit: ""
        },
        {
            id: 3,
            name_project: "Landing Page Adiwiyata",
            image: "/assets/adiwiyata.png",
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae similique possimus minus. Officia, dicta ratione quidem reiciendis itaque placeat id quibusdam maiores consectetur exercitationem, atque esse fugiat? Optio, voluptatibus dicta.",
            tech_stack: ["HTML", "Tailwind CSS"],
            code: "https://github.com/fahmiilmawan/adiwiyata.git"
        }
    ];

    // Mengembalikan data sebagai respons JSON
    return NextResponse.json({ data: dummyProjects });
}