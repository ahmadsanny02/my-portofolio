"use client"

import { Award, GitBranch, User } from "lucide-react";
import Skills from "./components/Skills";
import GitHubContribHeatmap from "./components/GitHubContribHeatmap";
import CertificateComponent from "./components/CertificateComponent";


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

      <div className="mt-10">
        <div className="flex items-center gap-1 font-semibold">
          <GitBranch />
          <h1 className="text-2xl">Github Contributions</h1>
        </div>
        <GitHubContribHeatmap user="ahmadsanny2" />
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-1 font-semibold">
          <Award />
          <h1 className="text-2xl">Certificates</h1>
        </div>
        <div className="mt-5">
          <CertificateComponent />
        </div>

      </div>
    </div>
  );
}
