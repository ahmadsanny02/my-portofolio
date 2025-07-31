import { User } from "lucide-react";
import Certificates from "./components/Certificates";
import Skills from "./components/Skills";


export default function Home() {
  return (
    <div className="">
      <div className="flex items-center gap-1">
        <User />
        <h1 className="text-2xl font-semibold">About Me</h1>
      </div>
      <p className="mt-5">
        Siswa SMK yang memiliki minat dan bakat di bidang teknologi. Memahami dasar-dasar konsep pemrograman web. Senang belajar hal baru, khususnya di bidang teknologi.
      </p>
      <Skills />
      <Certificates />
    </div>
  );
}
