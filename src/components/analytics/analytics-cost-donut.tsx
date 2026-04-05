"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { CostBreakdown } from "@/types"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#4f46e5", "#10b981", "#8b5cf6", "#6366f1", "#a78bfa"]

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: CostBreakdown & { fill: string } }[]
}) {
  if (!active || !payload?.[0]) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-slate-900">{row.category}</p>
      <p className="mt-0.5 text-sm text-slate-600 tabular-nums">
        {formatCurrency(row.amount)}
        <span className="text-slate-400"> · {row.percentage}%</span>
      </p>
    </div>
  )
}

export function AnalyticsCostDonut({ items }: { items: CostBreakdown[] }) {
  const data = items.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Cost breakdown</h2>
      <p className="mt-1 text-sm text-slate-500">Spend mix by category</p>
      <div className="mt-4 flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <div className="h-[240px] w-full max-w-[280px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={96}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full min-w-0 flex-1 space-y-3">
          {data.map((row) => (
            <li
              key={row.category}
              className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.fill }}
                  aria-hidden
                />
                <span className="truncate text-sm font-medium text-slate-800">{row.category}</span>
              </div>
              <div className="shrink-0 text-right text-sm tabular-nums">
                <span className="font-semibold text-slate-900">{formatCurrency(row.amount)}</span>
                <span className="ml-2 text-slate-500">{row.percentage}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
