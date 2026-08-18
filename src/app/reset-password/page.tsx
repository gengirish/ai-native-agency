"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Zap } from "lucide-react"

const MIN_PASSWORD_LENGTH = 8

type TokenState = "checking" | "valid" | "invalid"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [tokenState, setTokenState] = useState<TokenState>("checking")
  const [tokenError, setTokenError] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setTokenState("invalid")
      setTokenError("This reset link is invalid. Request a new one.")
      return
    }

    let cancelled = false

    async function verify() {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        )
        const data = await res.json().catch(() => ({}))
        if (cancelled) return

        if (res.ok && data.valid) {
          setTokenState("valid")
        } else {
          setTokenState("invalid")
          setTokenError(data.error || "This reset link is invalid. Request a new one.")
        }
      } catch {
        if (!cancelled) {
          setTokenState("invalid")
          setTokenError("Could not verify this link. Please try again.")
        }
      }
    }

    verify()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        // A dead token can't be retried — send the user back to request a new link.
        if (data.reason) {
          setTokenState("invalid")
          setTokenError(data.error)
        }
      } else {
        setDone(true)
        setTimeout(() => router.replace("/login"), 2500)
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
            Choose a new password
          </h1>
          <p className="mt-1 text-sm text-slate-400">AgencyOS account recovery</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-sm">
          {tokenState === "checking" && (
            <div className="flex flex-col items-center gap-3 py-6 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
              <p className="text-sm">Verifying your reset link&hellip;</p>
            </div>
          )}

          {tokenState === "invalid" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Link no longer valid</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{tokenError}</p>
              <Link
                href="/forgot-password"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Request a new link
              </Link>
            </div>
          )}

          {tokenState === "valid" && done && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Password updated</h2>
              <p className="mt-2 text-sm text-slate-400">Taking you to sign in&hellip;</p>
            </div>
          )}

          {tokenState === "valid" && !done && (
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
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    At least {MIN_PASSWORD_LENGTH} characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
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

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-400" />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
