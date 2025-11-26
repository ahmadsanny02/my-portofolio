"use client"

import { supabase } from "lib/supabaseClient"
import { Award } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

// 1. Definisikan tipe data agar tidak perlu pakai 'any'
interface Certificate {
    id: number
    image_url: string
    title: string
    issuer: string
    earned_at: string
    certificate_url: string
}

const CertificateComponent = () => {
    // 2. Gunakan tipe Certificate[]
    const [dataCertificates, setDataCertificates] = useState<Certificate[]>([])
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
                // Casting data ke tipe yang benar (opsional tapi aman)
                setDataCertificates((data as Certificate[]) || [])
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
                {/* 3. IMPLEMENTASI LOADING: Tampilkan Skeleton saat loading true */}
                {loading ? (
                    // Tampilkan 3 kotak loading palsu (Skeleton)
                    [1, 2, 3].map((i) => (
                        <div key={i} className="border border-slate-800 rounded-xl p-4 w-full h-[350px] animate-pulse bg-white/5">
                            <div className="bg-slate-700 h-48 rounded-lg mb-4"></div>
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    // Tampilkan data asli jika loading selesai
                    dataCertificates.map((item) => (
                        <div
                            key={item.id}
                            className="border border-slate-800 rounded-xl p-3 md:p-4 hover:bg-white/10 w-full hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            {item.image_url && (
                                <div className="rounded-lg overflow-hidden bg-slate-800 relative h-72 w-full">
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill // Gunakan fill agar responsif mengikuti parent
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-fill"
                                    />
                                </div>
                            )}
                            <div className="my-2">
                                <div className="flex justify-between gap-1 text-xs text-slate-400">
                                    {item.issuer && <p>{item.issuer}</p>}
                                    {item.earned_at && <p>{item.earned_at}</p>}
                                </div>
                                <h3 className="text-md font-semibold mt-1">{item.title}</h3>
                                {item.certificate_url && (
                                    <a
                                        href={item.certificate_url}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="inline-flex mt-2 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                                    >
                                        Lihat Certificate
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CertificateComponent