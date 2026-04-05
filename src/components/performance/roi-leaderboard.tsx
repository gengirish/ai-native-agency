"use client"

import type { PerformanceMetric } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { CHANNEL_LABELS, roiToneClass } from "./channel-styles"
import { formatCompactNumber } from "./format-metric"

function sortByRoi(metrics: PerformanceMetric[]) {
  return [...metrics].sort((a, b) => b.roi - a.roi)
}

export function RoiLeaderboard({ metrics }: { metrics: PerformanceMetric[] }) {
  const ranked = sortByRoi(metrics)

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">ROI Leaderboard</h2>
        <p className="text-sm text-slate-500">
          Deliverables ranked by return on spend
        </p>
      </div>
      <ul className="space-y-3">
        {ranked.map((row, i) => (
          <li
            key={row.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600 shadow-sm">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {row.projectTitle}
                </p>
                <p className="text-sm text-slate-500">
                  {CHANNEL_LABELS[row.channel]}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:justify-end">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Impressions
                </p>
                <p className="font-medium text-slate-800">
                  {formatCompactNumber(row.impressions)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Conversions
                </p>
                <p className="font-medium text-slate-800">{row.conversions}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Spend
                </p>
                <p className="font-medium text-slate-800">
                  {formatCurrency(row.spend)}
                </p>
              </div>
              <span
                className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums ${roiToneClass(row.roi)}`}
              >
                {row.roi.toFixed(1)}x
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
