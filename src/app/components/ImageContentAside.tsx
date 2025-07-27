import Image from "next/image";
import MyPhoto from "@/../public/assets/profil.png"

export default function ImageAside(){
    return(
        <div className="">
            <Image src={MyPhoto} alt="My Photo" width={400} height={400} className="bg-white/10 p-2 hover:bg-white transition-all duration-300 ease-in-out rounded-full"/>
        </div>
    )
}