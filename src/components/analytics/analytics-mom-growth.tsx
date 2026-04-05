"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import type { RevenueMetric } from "@/types"
import { cn, formatPercent } from "@/lib/utils"

function formatMonthShort(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function computeMomGrowth(metrics: RevenueMetric[]) {
  const out: { month: string; label: string; rate: number }[] = []
  for (let i = 1; i < metrics.length; i++) {
    const prev = metrics[i - 1].revenue
    const cur = metrics[i].revenue
    const rate = prev > 0 ? (cur - prev) / prev : 0
    out.push({
      month: metrics[i].month,
      label: formatMonthShort(metrics[i].month),
      rate,
    })
  }
  return out
}

export function AnalyticsMomGrowth({ metrics }: { metrics: RevenueMetric[] }) {
  const rows = computeMomGrowth(metrics)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-base font-semibold text-slate-900">Month-over-month growth</h2>
      <p className="mt-1 text-sm text-slate-500">Revenue delta vs prior month</p>
      <ul className="mt-5 space-y-3">
        {rows.map((row) => {
          const up = row.rate >= 0
          return (
            <li
              key={row.month}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5"
            >
              <span className="text-sm font-medium text-slate-700">{row.label}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
                  up ? "text-emerald-700" : "text-rose-600"
                )}
              >
                {up ? (
                  <TrendingUp className="size-4 shrink-0" aria-hidden />
                ) : (
                  <TrendingDown className="size-4 shrink-0" aria-hidden />
                )}
                {up ? "+" : ""}
                {formatPercent(row.rate)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
