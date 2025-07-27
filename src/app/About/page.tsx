import Certificates from "../components/CertificatesSection";
import Skills from "../components/SkillsSection";


export default function AboutPage() {
    return (
        <div className="mt-5">
            <p className="">
                Siswa SMK yang memiliki minat dan bakat di bidang teknologi. Memahami dasar-dasar konsep pemrograman web. Senang belajar hal baru, khususnya di bidang teknologi.
            </p>
            <Skills />
            <Certificates />
        </div>
    )
}