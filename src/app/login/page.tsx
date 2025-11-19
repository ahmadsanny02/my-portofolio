"use client"

import { supabase } from "lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setErrorMsg(error.message)
            setLoading(false)
            return
        }

        const allowedEmail = process.env.NEXT_PUBLIC_DASHBOARD_EMAIL
        if (allowedEmail && data.user?.email !== allowedEmail) {
            await supabase.auth.signOut()
            setErrorMsg("Email tidak diizinkan mengakses dashboard")
            setLoading(false)
            return
        }

        localStorage.setItem("dashboard-auth", "true")
        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
            <div className="w-full max-w-md border border-slate-800 rounded-2xl p-8 bg-slate-900/60 backdrop-blur">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Dashboard Login
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-60 py-2 text-sm font-medium transition"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}