"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { RevenueMetric } from "@/types"
import { formatPercent } from "@/lib/utils"

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

function MarginTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length || !label) return null
  const v = payload[0].value
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-slate-500">{formatMonthLabel(label)}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-700 tabular-nums">
        {formatPercent(v)}
      </p>
    </div>
  )
}

export function AnalyticsMarginTrendChart({ data }: { data: RevenueMetric[] }) {
  const lastSix = data.slice(-6)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Margin trend</h2>
      <p className="mt-1 text-sm text-slate-500">Gross margin % — last 6 months</p>
      <div className="mt-6 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lastSix} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              domain={["dataMin - 0.05", "dataMax + 0.02"]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<MarginTooltip />} />
            <Line
              type="monotone"
              dataKey="margin"
              name="Margin"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#059669", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#047857", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
