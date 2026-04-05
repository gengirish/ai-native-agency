"use client"

import { cn } from "@/lib/utils"
import { ordinalPercentile } from "./benchmarks-utils"

type BenchmarksScoreCardProps = {
  scorePercentile: number
  className?: string
}

export function BenchmarksScoreCard({ scorePercentile, className }: BenchmarksScoreCardProps) {
  const rounded = Math.round(scorePercentile)
  const size = 176
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const progress = clamp(rounded / 100, 0, 1)
  const dash = c * progress

  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Agency Performance Score
          </p>
          <p className="text-lg font-medium text-slate-900">
            You outperform{" "}
            <span className="text-indigo-600 tabular-nums">{rounded}%</span> of agencies
          </p>
          <p className="max-w-md text-sm text-slate-600">
            Based on average standing across speed, cost, quality, and scale benchmarks versus
            traditional agency baselines.
          </p>
        </div>

        <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90" aria-hidden>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              className="text-slate-100"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              className="text-indigo-600 transition-[stroke-dashoffset] duration-700 ease-out"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums text-slate-900">{rounded}</span>
            <span className="text-xs font-medium text-slate-500">percentile</span>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-slate-200 md:block" aria-hidden />

        <div className="text-center md:text-left">
          <p className="text-sm text-slate-600">Composite rank</p>
          <p className="mt-1 text-xl font-semibold text-indigo-700 tabular-nums">
            {ordinalPercentile(rounded)}
          </p>
        </div>
      </div>
    </section>
  )
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}
