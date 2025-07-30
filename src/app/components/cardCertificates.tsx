import Image from "next/image";

export default function cardCertificates() {
    const dataCertificates = [
        { image: "/assets/certificates/certificateCertifiedDeveloper.png" },
        { image: "/assets/certificates/certificateBelajarDasarAIEN.jpg" },
        { image: "/assets/certificates/certificateCompetitionWebDesignInvofest2024.jpg" },
        { image: "/assets/certificates/certificateMahirMembuatWebsiteDenganHtmlCssDanJavascript.jpg" },
        { image: "/assets/certificates/certificateBackendDevelopmentFundamental.jpg" },
        { image: "/assets/certificates/certificateBelajarBootstrapCssFramework.jpg" },
        { image: "/assets/certificates/certificateBelajarDasarCSS.jpg" },
        { image: "/assets/certificates/certificateBelajarDasarDasarHTMLDanCSS.jpg" },
        { image: "/assets/certificates/certificateBelajarDasarHTML.jpg" },
        { image: "/assets/certificates/certificateBelajarDasarPemrogramanWeb.jpg" },
        { image: "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg" },
        { image: "/assets/certificates/certificateBelajarJavascript.jpg" },
        { image: "/assets/certificates/certificateBelajarMembuatFrontEndWebUntukPemula.jpg" },
        { image: "/assets/certificates/certificateBelajarPemrogramanJavascript.jpg" },
        { image: "/assets/certificates/certificateBelajarReactFundamental.jpg" },
        { image: "/assets/certificates/certificateComparisonAndLogicalOperator.jpg" },
        { image: "/assets/certificates/certificateDocumentObjectModelPart1.jpg" },
        { image: "/assets/certificates/certificateDocumentObjectModelPart2.jpg" },
        { image: "/assets/certificates/certificateIntroductionJavascript.jpg" },
        { image: "/assets/certificates/certificateJavascriptDom.jpg" },
        { image: "/assets/certificates/certificateKonsepOopJavascript.jpg" },
        { image: "/assets/certificates/certificateMembuatHalamanWebsitePortofolioMenggunakanTailwindcss.jpg" },
        { image: "/assets/certificates/certificateMengenalPemrogramanKomputer.jpg" },
        { image: "/assets/certificates/certificateMiniClassBasicTailwindcss.jpg" },
        { image: "/assets/certificates/certificatePanduanAwalMenjadiFullstackWebDeveloper.jpg" },
        { image: "/assets/certificates/certificatePanduanLengkapCrudPemula.jpg" },
        { image: "/assets/certificates/certificatePengenalanDatabaseMenggunakanMysql.jpg" }

    ]

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
            {dataCertificates.map((certificate, index) => (
                <div className={`bg-white/10 p-2 w-full border-2 border-transparent hover:border-white transition-all duration-300 ease-in-out rounded-2xl ${certificate.image === "/assets/certificates/certificateMiniBootcampJavascriptDanDom.jpg" ? "h-full row-span-2" : "h-52"}`} key={index}>
                    <Image src={certificate.image} priority alt="Certificates" width="720" height="1600" className="w-full h-full rounded-2xl" />
                </div>
            ))}

        </div>
    )
}