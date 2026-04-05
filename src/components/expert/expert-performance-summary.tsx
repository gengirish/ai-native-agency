"use client"

import type { ExpertAssignment } from "@/types"
import { TrendingUp } from "lucide-react"

type ExpertPerformanceSummaryProps = {
  assignments: ExpertAssignment[]
}

export function ExpertPerformanceSummary({ assignments }: ExpertPerformanceSummaryProps) {
  const completed = assignments.filter((a) => a.status === "completed")
  const totalReviews = completed.length
  const withTime = completed.filter((a) => a.reviewTimeMinutes > 0)
  const avgTime =
    withTime.length > 0
      ? Math.round(
          (withTime.reduce((s, a) => s + a.reviewTimeMinutes, 0) / withTime.length) * 10
        ) / 10
      : 0
  const withImprovement = completed.filter((a) => a.qualityAfter > 0)
  const avgImprovement =
    withImprovement.length > 0
      ? Math.round(
          (withImprovement.reduce(
            (s, a) => s + (a.qualityAfter - a.qualityBefore),
            0
          ) /
            withImprovement.length) *
            100
        ) / 100
      : 0
  const escalatedOrElevated = assignments.filter(
    (a) =>
      a.status === "escalated" ||
      a.escalationLevel === "senior" ||
      a.escalationLevel === "manual_required"
  ).length
  const escalationRate =
    assignments.length > 0
      ? Math.round((escalatedOrElevated / assignments.length) * 1000) / 10
      : 0

  const items = [
    { label: "Total reviews", value: String(totalReviews) },
    { label: "Avg time", value: avgTime > 0 ? `${avgTime} min` : "—" },
    {
      label: "Avg quality Δ",
      value: avgImprovement > 0 ? `+${avgImprovement.toFixed(2)}` : "—",
    },
    { label: "Escalation rate", value: `${escalationRate}%` },
  ]

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Expert Performance Summary</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
