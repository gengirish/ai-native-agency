"use client"

import type { ReactNode } from "react"
import type { PerformanceMetric } from "@/types"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import { ArrowDownUp } from "lucide-react"
import { CHANNEL_LABELS, roiTextClass } from "./channel-styles"
import { formatCompactNumber } from "./format-metric"

function SortableHead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <th scope="col" className={cn("px-4 py-3", className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-left font-medium text-slate-600 hover:text-slate-900"
      >
        {children}
        <ArrowDownUp className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
      </button>
    </th>
  )
}

export function DeliverablePerformanceTable({
  metrics,
}: {
  metrics: PerformanceMetric[]
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Deliverable Performance
        </h2>
        <p className="text-sm text-slate-500">
          Full metrics for every tracked deliverable
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <SortableHead className="rounded-tl-xl">Project</SortableHead>
              <SortableHead>Channel</SortableHead>
              <SortableHead className="text-right">Impressions</SortableHead>
              <SortableHead className="text-right">Clicks</SortableHead>
              <SortableHead className="text-right">CTR</SortableHead>
              <SortableHead className="text-right">Conversions</SortableHead>
              <SortableHead className="text-right">Spend</SortableHead>
              <SortableHead className="rounded-tr-xl text-right">ROI</SortableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.projectTitle}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {CHANNEL_LABELS[row.channel]}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                  {formatCompactNumber(row.impressions)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                  {row.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                  {formatPercent(row.ctr)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                  {row.conversions}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                  {formatCurrency(row.spend)}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right text-sm font-semibold tabular-nums",
                    roiTextClass(row.roi)
                  )}
                >
                  {row.roi.toFixed(1)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
