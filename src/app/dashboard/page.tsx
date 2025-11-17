"use client"

import { useRouter } from "next/router"
import { useEffect } from "react"

export default function DashboardIndexPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/dashboard/projects")
    }, [router])

    return null
}