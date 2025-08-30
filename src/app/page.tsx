"use client"

import { User } from "lucide-react";
import Certificates from "./components/Certificates";
import Skills from "./components/Skills";
import { TypeAnimation } from "react-type-animation";


export default function Home() {
  return (
    <div className="">
      <div className="flex items-center gap-1">
        <User />
        <h1 className="text-2xl font-semibold">About Me</h1>
      </div>
      <p className="mt-5">
        I am a Software Engineering graduate with experience in front-end website development using Next.js, React.js, Laravel, and Tailwind CSS. I am comfortable working in a team, quick to adapt, and skilled in building responsive UIs.
      </p>
      <Skills />
      <Certificates />
    </div>
  );
}
