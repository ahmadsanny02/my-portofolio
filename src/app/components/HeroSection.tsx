import ImageAside from "./ImageContentAside";
import TextAside from "./TextContentAside";

export default function HeroSection() {
    return (
        <div className="flex justify-between px-20 h-full items-center">
            <TextAside />
            <ImageAside />
        </div>
    )
}