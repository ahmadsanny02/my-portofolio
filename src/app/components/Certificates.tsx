import { Award } from "lucide-react";
import Tabs from "./Tabs";

export default function Certificates() {

    return (
        <div className="mt-10">
            <div className="flex items-center gap-1 font-semibold">
                <Award />
                <h1 className="text-2xl">Certificates</h1>
            </div>
            <div className="">
                <Tabs />
            </div>

        </div>
    )
}