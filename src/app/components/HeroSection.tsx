import ImageAside from "./ImageContentAside";
import TextAside from "./TextContentAside";

export default function HeroSection() {
    return (
        <div className="flex flex-col lg:flex-row justify-between h-full items-center">
            <TextAside />
            <ImageAside />
        </div>
    )
}