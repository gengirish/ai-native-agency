"use client"

import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

type BenchmarksInsightsPanelProps = {
  insights: string[]
  className?: string
}

export function BenchmarksInsightsPanel({ insights, className }: BenchmarksInsightsPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8",
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Lightbulb className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Key insights</h2>
          <p className="text-sm text-slate-600">Derived from your metrics vs industry averages</p>
        </div>
      </div>
      <ul className="space-y-3">
        {insights.map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700"
          >
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </section>
  )
}
