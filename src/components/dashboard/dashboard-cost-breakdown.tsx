"use client"

import { Cpu, TrendingDown, TrendingUp, Minus } from "lucide-react"
import type { CostBreakdown } from "@/types"
import { formatCurrency } from "@/lib/utils"

function TrendIcon({ trend }: { trend: CostBreakdown["trend"] }) {
  if (trend === "up") return <TrendingUp className="size-3.5 text-emerald-600" aria-hidden />
  if (trend === "down") return <TrendingDown className="size-3.5 text-rose-600" aria-hidden />
  return <Minus className="size-3.5 text-slate-400" aria-hidden />
}

export function DashboardCostBreakdown({ items }: { items: CostBreakdown[] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Cpu className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI cost breakdown</h2>
          <p className="mt-1 text-sm text-slate-500">Spend by category this period</p>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((row) => (
          <li key={row.category}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-800">{row.category}</span>
              <span className="flex items-center gap-1.5 tabular-nums text-slate-600">
                <TrendIcon trend={row.trend} />
                {formatCurrency(row.amount)}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${Math.min(row.percentage, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">{row.percentage}% of total</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
