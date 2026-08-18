"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Loader2, MailCheck, Zap } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
      } else {
        setSent(true)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            We&apos;ll email you a link to choose a new one
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-sm">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <MailCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Check your inbox</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                If an account exists for <span className="text-slate-200">{email}</span>,
                we&apos;ve sent password reset instructions. The link expires in 60 minutes.
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Didn&apos;t get it? Check spam, or{" "}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  try another address
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="you@company.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
