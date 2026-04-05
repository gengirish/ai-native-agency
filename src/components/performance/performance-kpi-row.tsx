"use client"

import { Eye, MousePointerClick, Target, TrendingUp } from "lucide-react"
import type { PerformanceMetric } from "@/types"
import { formatCompactNumber } from "./format-metric"
import { formatPercent } from "@/lib/utils"
import { cn } from "@/lib/utils"

function aggregate(metrics: PerformanceMetric[]) {
  const totalImpressions = metrics.reduce((s, m) => s + m.impressions, 0)
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0)
  const weightedCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0
  const totalConversions = metrics.reduce((s, m) => s + m.conversions, 0)
  const avgRoi =
    metrics.length > 0
      ? metrics.reduce((s, m) => s + m.roi, 0) / metrics.length
      : 0
  return { totalImpressions, weightedCtr, totalConversions, avgRoi }
}

const cardBase =
  "rounded-xl border border-slate-100 bg-white p-5 shadow-sm"

export function PerformanceKpiRow({ metrics }: { metrics: PerformanceMetric[] }) {
  const { totalImpressions, weightedCtr, totalConversions, avgRoi } =
    aggregate(metrics)

  const items = [
    {
      label: "Total Impressions",
      value: formatCompactNumber(totalImpressions),
      sub: "Across all channels",
      icon: Eye,
      iconBg: "bg-violet-100 text-violet-700",
    },
    {
      label: "Avg CTR",
      value: formatPercent(weightedCtr),
      sub: "Weighted by impressions",
      icon: MousePointerClick,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
    {
      label: "Total Conversions",
      value: String(totalConversions),
      sub: "Attributed to deliverables",
      icon: Target,
      iconBg: "bg-amber-100 text-amber-800",
    },
    {
      label: "Avg ROI",
      value: `${avgRoi.toFixed(1)}x`,
      sub: "Return multiplier",
      icon: TrendingUp,
      iconBg: "bg-emerald-100 text-emerald-700",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={cardBase}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
            </div>
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                item.iconBg
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
