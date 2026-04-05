"use client"

import { Sparkles, TrendingUp } from "lucide-react"

const highlights = [
  {
    label: "Click-through rate",
    yours: "Your AI-generated ads achieve",
    stat: "2.3× higher CTR",
    rest: "than industry average for comparable spend.",
  },
  {
    label: "Cost per conversion",
    yours: "AI-assisted creative workflows drive",
    stat: "38% lower CPA",
    rest: "versus traditional agency benchmarks.",
  },
  {
    label: "Time to live",
    yours: "Deliverables reach market",
    stat: "4.2× faster",
    rest: "from brief approval to first impression.",
  },
]

export function AiVsTraditionalCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Benchmark
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
            AI-Generated Asset Performance vs Industry Average
          </h2>
          <p className="mt-2 text-slate-600">
            AgencyOS compares in-market results from AI-native production to
            published benchmarks across paid social, email, and display — so
            you can quantify the upside of your stack.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-emerald-900">
          <TrendingUp className="h-5 w-5" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
              Composite edge
            </p>
            <p className="text-lg font-semibold">+2.1× weighted uplift</p>
          </div>
        </div>
      </div>

      <ul className="relative mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((h) => (
          <li
            key={h.label}
            className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {h.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {h.yours}{" "}
              <span className="font-semibold text-emerald-700">{h.stat}</span>{" "}
              {h.rest}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
