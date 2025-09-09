"use client";
import Image from "next/image";
import { useState, useMemo } from "react";

// ————————————————————————————————
// Minimal, accessible tabs component for Next.js (App Router compatible)
// TailwindCSS styles; no external UI deps. 
// Tab 1: All items; Tab 2..n: filtered by category (acts like an ID)
// Swap the sample `CERTIFICATES` with your real data.
// ————————————————————————————————

// Example data model — adapt as needed
export type Certificate = {
    id: number;
    image: string;
    category: "programming" | "ai" | "competition" | "internship" | string; // treat as an ID
};

const CERTIFICATES: Certificate[] = [
    {
        id: 1,
        image: "/assets/certificates/certificateCertifiedDeveloper.png",
        category: "programming"
    },
    {
        id: 2,
        image: "/assets/certificates/certificateBelajarDasarAIEN.jpg",
        category: "ai"
    },
    {
        id: 3,
        image: "/assets/certificates/certificateCompetitionWebDesignInvofest2024.jpg",
        category: "competition"
    },
    {
        id: 4,
        image: "/assets/certificates/certificateMahirMembuatWebsiteDenganHtmlCssDanJavascript.jpg",
        category: "programming"
    },
    {
        id: 5,
        image: "/assets/certificates/certificateBackendDevelopmentFundamental.jpg",
        category: "programming"
    },
    {
        id: 6,
        image: "/assets/certificates/certificateBelajarBootstrapCssFramework.jpg",
        category: "programming"
    },
    {
        id: 7,
        image: "/assets/certificates/certificateBelajarDasarCSS.jpg",
        category: "programming"
    },
    {
        id: 8,
        image: "/assets/certificates/certificateBelajarDasarDasarHTMLDanCSS.jpg",
        category: "programming"
    },
    {
        id: 9,
        image: "/assets/certificates/certificateBelajarDasarHTML.jpg",
        category: "programming"
    },
    {
        id: 10,
        image: "/assets/certificates/certificateBelajarDasarPemrogramanWeb.jpg",
        category: "programming"
    },
    {
        id: 11,
        image: "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg",
        category: "programming"
    },
    {
        id: 12,
        image: "/assets/certificates/certificateBelajarJavascript.jpg",
        category: "programming"
    },
    {
        id: 13,
        image: "/assets/certificates/certificateBelajarMembuatFrontEndWebUntukPemula.jpg",
        category: "programming"
    },
    {
        id: 14,
        image: "/assets/certificates/certificateBelajarPemrogramanJavascript.jpg",
        category: "programming"
    },
    {
        id: 15,
        image: "/assets/certificates/certificateBelajarReactFundamental.jpg",
        category: "programming"
    },
    {
        id: 16,
        image: "/assets/certificates/certificateComparisonAndLogicalOperator.jpg",
        category: "programming"
    },
    {
        id: 17,
        image: "/assets/certificates/certificateDocumentObjectModelPart1.jpg",
        category: "programming"
    },
    {
        id: 18,
        image: "/assets/certificates/certificateDocumentObjectModelPart2.jpg",
        category: "programming"
    },
    {
        id: 19,
        image: "/assets/certificates/certificateIntroductionJavascript.jpg",
        category: "programming"
    },
    {
        id: 20,
        image: "/assets/certificates/certificateJavascriptDom.jpg",
        category: "programming"
    },
    {
        id: 21,
        image: "/assets/certificates/certificateKonsepOopJavascript.jpg",
        category: "programming"
    },
    {
        id: 22,
        image: "/assets/certificates/certificateMembuatHalamanWebsitePortofolioMenggunakanTailwindcss.jpg",
        category: "programming"
    },
    {
        id: 23,
        image: "/assets/certificates/certificateMengenalPemrogramanKomputer.jpg",
        category: "programming"
    },
    {
        id: 24,
        image: "/assets/certificates/certificateMiniClassBasicTailwindcss.jpg",
        category: "programming"
    },
    {
        id: 25,
        image: "/assets/certificates/certificatePanduanAwalMenjadiFullstackWebDeveloper.jpg",
        category: "programming"
    },
    {
        id: 26,
        image: "/assets/certificates/certificatePanduanLengkapCrudPemula.jpg",
        category: "programming"
    },
    {
        id: 27,
        image: "/assets/certificates/certificatePengenalanDatabaseMenggunakanMysql.jpg",
        category: "programming"
    },
    {
        id: 28,
        image: "/assets/certificates/certificatesPraktikKerjaIndustriPTSampulKreatifTeknologi.jpg",
        category: "internship"
    },

];

// Define your tabs. The `key` maps to the category/ID filter.
const TABS: { key: string; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "programming", label: "Programming" },
    { key: "ai", label: "AI" },
    { key: "competition", label: "Competition" },
    { key: "internship", label: "Internship" }
    // Tambahkan tab lain di sini bila perlu, pastikan key sama dengan nilai `category`
];

export default function Tabs({
    items = CERTIFICATES,
}: {
    items?: Certificate[];
}) {
    const [activeTab, setActiveTab] = useState<string>(TABS[0].key);

    const filtered = useMemo(() => {
        if (activeTab === "all") return items;
        return items.filter((it) => String(it.category) === activeTab);
    }, [items, activeTab]);

    return (
        <div className="">

            {/* Tabs */}
            <div className="flex snap-mandatory overflow-auto">
                <div className="flex shrink-0 gap-5">
                    <div role="tablist" aria-label="Kategori Sertifikat" className="flex gap-2 rounded-2xl p-1">
                        {TABS.map((t) => {
                            const selected = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`panel-${t.key}`}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`hover:bg-blue-500 hover:text-white cursor-pointer ${selected ? "bg-blue-500" : "bg-white/10"} px-7 py-1 rounded-full`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>


            {/* Panel */}
            <section
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={activeTab}
                className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
                {filtered.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
                        Tidak ada sertifikat pada kategori ini.
                    </div>
                ) : (
                    filtered.map((c) => <CertificateCard key={c.id} cert={c} />)
                )}
            </section>
        </div>
    );
}

function CertificateCard({ cert }: { cert: Certificate }) {
    return (
        <div className={`bg-white/10 p-2 w-full border-2 border-transparent hover:border-white transition-all duration-300 ease-in-out rounded-2xl ${cert.image === "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg" ? "h-full row-span-2" : "h-52"}`}>
            <Image src={cert.image} priority alt="Certificates" width={cert.image === "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg" ? "720" : "1600"} height={cert.image === "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg" ? "1600" : "720"} className="w-full h-full rounded-2xl" placeholder="blur" />
        </div>
    );
}

