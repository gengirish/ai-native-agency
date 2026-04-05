"use client"

import { ArrowDown, ArrowUp, Minus, Star } from "lucide-react"
import type { Benchmark, BenchmarkTrend } from "@/types"
import { cn } from "@/lib/utils"
import {
  formatBenchmarkValue,
  getBarPositions,
  ordinalPercentile,
  percentileBadgeClass,
} from "./benchmarks-utils"

function TrendIcon({ trend }: { trend: BenchmarkTrend }) {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-600" strokeWidth={2.25} />
  return <Minus className="h-4 w-4 text-slate-400" strokeWidth={2.25} />
}

export function BenchmarkMetricCard({ benchmark }: { benchmark: Benchmark }) {
  const { you, industry, top } = getBarPositions(benchmark)

  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-900">{benchmark.metric}</h3>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {formatBenchmarkValue(benchmark)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
              percentileBadgeClass(benchmark.percentile)
            )}
          >
            {ordinalPercentile(benchmark.percentile)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <TrendIcon trend={benchmark.trend} />
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>vs industry and top performers</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden />
              Industry avg
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden />
              Top performer
            </span>
          </span>
        </div>

        <div className="relative h-3 rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-indigo-500/25"
            style={{ width: `${you}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-1 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-indigo-600 shadow-sm ring-2 ring-white"
            style={{ left: `${you}%` }}
            title="Your position"
          />
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500"
            style={{ left: `${industry}%` }}
            title="Industry average"
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${top}%` }}
          >
            <Star className="h-4 w-4 fill-amber-400 text-amber-600 drop-shadow-sm" />
          </div>
        </div>
      </div>
    </article>
  )
}
