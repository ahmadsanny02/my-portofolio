"use client"

import { supabase } from "lib/supabaseClient"
import { Award } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

const CertificateComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dataCertificates, setDataCertificates] = useState<any[]>([])
    const [loading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCertificates = async () => {
            const { data, error } = await supabase
                .from("certificates")
                .select("*")
                .order("earned_at", { ascending: true })

            if (error) {
                console.log("Supabase Error:", error)
            } else {
                setDataCertificates(data || [])
            }
            setIsLoading(false)
        }
        fetchCertificates()
    }, [])

    return (
        <div className="mt-10">
            <div className="flex items-center gap-1 font-semibold">
                <Award />
                <h1 className="text-2xl">Certificates</h1>
            </div>
            <p className="my-5">
                The following certificates showcase my track record in learning, competing, and contributing in the field of technology.
            </p>
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {dataCertificates.map((item) => (
                    <div
                        key={item.id}
                        className="border border-slate-800 rounded-xl p-3 md:p-4 hover:bg-white/10 w-full hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        {item.image_url && (
                            <div className="rounded-lg overflow-hidden bg-slate-800">
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-72 object-fill"
                                />
                            </div>
                        )}
                        <div className="my-2">
                            <div className="flex justify-between gap-1 text-xs text-slate-400">
                                {item.issuer && <p>{item.issuer}</p>}
                                {item.earned_at && <p>{item.earned_at}</p>}
                            </div>
                            <h3 className="text-md font-semibold">{item.title}</h3>
                            {item.certificate_url && (
                                <a
                                    href={item.certificate_url}
                                    target="_blank"
                                    className="inline-flex mt-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                                >
                                    Lihat Certificate
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CertificateComponent