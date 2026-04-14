"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import type { UserRole } from "@/types"
import { Zap, ArrowRight, AlertCircle, Shield, Palette, User } from "lucide-react"

type Mode = "login" | "register"

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Agency Admin", description: "Full platform access" },
  { value: "expert", label: "Expert Reviewer", description: "Review & QA workflows" },
  { value: "client", label: "Client", description: "View projects & brand assets" },
]

const DEMO_ACCOUNTS = [
  {
    label: "Agency Admin",
    description: "Full access — dashboard, CRM, billing, AI engine",
    email: "admin@agencyos.demo",
    password: "demo123",
    icon: Shield,
    color: "from-indigo-500 to-purple-600",
    ring: "ring-indigo-500/30",
  },
  {
    label: "Expert Reviewer",
    description: "Review queue, QA workflows, deliverable feedback",
    email: "maya@agencyos.demo",
    password: "demo123",
    icon: Palette,
    color: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/30",
  },
  {
    label: "Client",
    description: "Project briefs, brand assets, billing view",
    email: "sarah@agencyos.demo",
    password: "demo123",
    icon: User,
    color: "from-amber-500 to-orange-600",
    ring: "ring-amber-500/30",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isAuthenticated } = useAuth()
  const [mode, setMode] = useState<Mode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("admin")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)

  if (isAuthenticated) {
    router.replace("/dashboard")
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password, role)

    if (result.success) {
      router.replace("/dashboard")
    } else {
      setError(result.error || "Something went wrong")
    }
    setLoading(false)
  }

  async function handleDemoLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    setError("")
    setDemoLoading(account.email)
    const result = await login(account.email, account.password)
    if (result.success) {
      router.replace("/dashboard")
    } else {
      setError(result.error || "Demo login failed")
    }
    setDemoLoading(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AgencyOS
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            AI-Native Agency Platform
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Instant Demo Access
          </p>
          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon
              const isLoading = demoLoading === account.email
              return (
                <button
                  key={account.email}
                  type="button"
                  disabled={!!demoLoading}
                  onClick={() => handleDemoLogin(account)}
                  className={`flex w-full items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-left transition-all hover:border-slate-600 hover:bg-slate-800 disabled:opacity-60 focus:outline-none focus:ring-2 ${account.ring}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${account.color}`}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Icon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-200">
                      {account.label}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {account.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-sm">
          <div className="mb-6 flex rounded-lg bg-slate-800/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setError("")
              }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "login" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setError("")
              }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === "register" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Role
                </label>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                        role === opt.value
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={opt.value}
                        checked={role === opt.value}
                        onChange={() => setRole(opt.value)}
                        className="accent-indigo-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-500">
                          {opt.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Multi-tenant RBAC &middot; Role-gated routing &middot;
          Permission-based UI
        </p>
      </div>
    </div>
  )
}
