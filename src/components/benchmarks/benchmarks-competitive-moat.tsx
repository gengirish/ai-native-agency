"use client"

import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export type MoatPillar = {
  key: string
  label: string
  you: number
  industry: number
}

type BenchmarksCompetitiveMoatProps = {
  pillars: MoatPillar[]
  className?: string
}

export function BenchmarksCompetitiveMoat({ pillars, className }: BenchmarksCompetitiveMoatProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8",
        className
      )}
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Shield className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Competitive moat</h2>
          <p className="mt-1 text-sm text-slate-600">
            Advantages that compound over time — your standing vs a typical agency (50th
            percentile baseline).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {pillars.map((p) => (
          <div key={p.key}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-800">{p.label}</span>
              <span className="text-xs text-slate-500 tabular-nums">
                You {p.you.toFixed(0)} · Industry ~{p.industry}
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Your agency</span>
                  <span className="tabular-nums text-indigo-700">{p.you.toFixed(0)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, p.you)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Industry typical</span>
                  <span className="tabular-nums text-slate-600">{p.industry}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, p.industry)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
