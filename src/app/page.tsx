"use client"

import About from "./About/page";
import Skills from "./Skills/page";
import GithubContributions from "./GithubContributions/page";
import Certificates from "./Certificates/page";


export default function Home() {
  return (
    <div className="">
      <About />
      <Skills />
      <GithubContributions />
      <Certificates />
    </div>
  );
}
