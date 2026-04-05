"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { RevenueMetric } from "@/types"
import { formatCurrency, formatPercent } from "@/lib/utils"

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

function RevenueProfitTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { payload?: RevenueMetric }[]
  label?: string
}) {
  if (!active || !payload?.[0]?.payload || !label) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-md">
      <p className="text-xs font-medium text-slate-500">{formatMonthLabel(label)}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
        <li className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-indigo-500" aria-hidden />
            Revenue
          </span>
          <span className="font-semibold tabular-nums">{formatCurrency(row.revenue)}</span>
        </li>
        <li className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
            Profit
          </span>
          <span className="font-semibold tabular-nums">{formatCurrency(row.profit)}</span>
        </li>
        <li className="flex items-center justify-between gap-6 border-t border-slate-100 pt-1.5 text-slate-600">
          <span>Margin</span>
          <span className="font-semibold tabular-nums text-slate-900">
            {formatPercent(row.margin)}
          </span>
        </li>
      </ul>
    </div>
  )
}

export function AnalyticsRevenueProfitChart({ data }: { data: RevenueMetric[] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Revenue &amp; profit</h2>
      <p className="mt-1 text-sm text-slate-500">Dual trend with gross margin context</p>
      <div className="mt-6 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsRevFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="analyticsProfitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<RevenueProfitTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#analyticsRevFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#4338ca" }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#analyticsProfitFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#047857" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
