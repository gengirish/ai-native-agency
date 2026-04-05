"use client"

import type { Project } from "@/types"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"

type ClientRevenueRow = {
  clientName: string
  projectCount: number
  revenue: number
  avgProjectValue: number
  margin: number
}

function buildClientRows(projects: Project[]): ClientRevenueRow[] {
  const byClient = new Map<
    string,
    { revenue: number; aiCost: number; count: number }
  >()
  for (const p of projects) {
    const cur = byClient.get(p.clientName) ?? { revenue: 0, aiCost: 0, count: 0 }
    cur.revenue += p.actualCost
    cur.aiCost += p.aiCost
    cur.count += 1
    byClient.set(p.clientName, cur)
  }
  return [...byClient.entries()]
    .map(([clientName, agg]) => {
      const margin =
        agg.revenue > 0 ? (agg.revenue - agg.aiCost) / agg.revenue : 0
      return {
        clientName,
        projectCount: agg.count,
        revenue: agg.revenue,
        avgProjectValue: agg.count > 0 ? agg.revenue / agg.count : 0,
        margin,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
}

export function AnalyticsClientRevenueTable({ projects }: { projects: Project[] }) {
  const rows = buildClientRows(projects)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Client revenue</h2>
      <p className="mt-1 text-sm text-slate-500">
        Grouped from project actual revenue (actualCost) and AI spend
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 pr-4 font-medium">Client</th>
              <th className="pb-3 pr-4 font-medium tabular-nums">Projects</th>
              <th className="pb-3 pr-4 font-medium tabular-nums">Revenue</th>
              <th className="pb-3 pr-4 font-medium tabular-nums">Avg project value</th>
              <th className="pb-3 font-medium tabular-nums">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.clientName} className="text-slate-800">
                <td className="py-3 pr-4 font-medium">{row.clientName}</td>
                <td className="py-3 pr-4 tabular-nums text-slate-600">{row.projectCount}</td>
                <td className="py-3 pr-4 font-semibold tabular-nums text-slate-900">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="py-3 pr-4 tabular-nums text-slate-600">
                  {formatCurrency(row.avgProjectValue)}
                </td>
                <td
                  className={cn(
                    "py-3 font-semibold tabular-nums",
                    row.margin >= 0.999 ? "text-emerald-700" : "text-slate-900"
                  )}
                >
                  {formatPercent(row.margin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
