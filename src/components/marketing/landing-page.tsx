"use client"

import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"

const pillars = [
  {
    icon: Layers,
    title: "One system for delivery",
    body: "Briefs, brand DNA, pipelines, expert QA, and client review — orchestrated as a single workflow instead of a dozen tools.",
  },
  {
    icon: Cpu,
    title: "AI production you can meter",
    body: "Route models by task, track cost per deliverable, and show clients exactly what automation bought versus expert time.",
  },
  {
    icon: Shield,
    title: "Trust at enterprise depth",
    body: "Tenant isolation, SLAs, audit-friendly review history, and escalation paths when quality bars are not met.",
  },
]

const proofPoints = [
  { label: "What top AI-native shops aim for", value: "2×", sub: "faster iteration vs. classic staffing" },
  { label: "Economics teams design toward", value: "60%+", sub: "gross margin with blended delivery" },
  { label: "Quality bar in the product", value: "8.5+", sub: "review scoring & SLAs (demo data)" },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Zap className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">AgencyOS</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Operating system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Built for agencies that ship client work with AI — not slides about AI
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              The operating system for{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                AI-native agencies
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-400 sm:text-xl">
              Replace fragmented creative stacks with one control plane: intake → generation → expert review → delivery
              → performance — with economics that look like software, not hourly staffing.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:bg-slate-100"
              >
                Open the product
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="text-xs text-slate-500">
                No credit card for the demo workspace · Register in one step
              </p>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            {proofPoints.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-left backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white sm:text-3xl">{p.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-300">{p.label}</p>
                <p className="mt-2 text-xs text-slate-500">{p.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/5 bg-slate-900/50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
              Why teams standardize on AgencyOS
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {pillars.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  From “AI experiments” to a repeatable delivery engine
                </h2>
                <p className="mt-4 text-slate-400">
                  Investors and buyers do not reward one-off prompts. They reward systems: measurable throughput, margin
                  per account, and quality that survives real client review. AgencyOS is the layer that makes that
                  operational.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Model routing and cost telemetry per deliverable",
                    "Expert QA with SLAs and escalation when automation is wrong",
                    "CRM and pipeline tied to speculative creative — close faster with proof",
                    "Publishing and performance feedback loops without another point solution",
                  ].map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inside the app</p>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: BarChart3, t: "Dashboard & unit economics" },
                    { icon: Bot, t: "Autonomy engine & guardrails" },
                    { icon: Users, t: "Expert queue & review hub" },
                  ].map((row) => (
                    <div
                      key={row.t}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      <row.icon className="h-5 w-5 text-indigo-400" aria-hidden />
                      <span className="text-sm font-medium text-slate-200">{row.t}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-relaxed text-slate-500">
                  Demo data is enabled by default so every screen tells a story. Disable with{" "}
                  <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                    NEXT_PUBLIC_USE_DEMO_DATA=false
                  </code>{" "}
                  when wiring your API.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-indigo-950/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">See the full platform in minutes</h2>
            <p className="mt-3 text-slate-400">
              Create an account, explore a populated workspace, and walk through the same flows we show in partner
              reviews.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Launch AgencyOS
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} AgencyOS. Demo product UI.</p>
          <Link href="/login" className="text-xs font-medium text-slate-500 hover:text-slate-400">
            Sign in →
          </Link>
        </div>
      </footer>
    </div>
  )
}
