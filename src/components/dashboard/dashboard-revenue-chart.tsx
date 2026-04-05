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
import { formatCurrency } from "@/lib/utils"

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length || !label) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-slate-500">{formatMonthLabel(label)}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center gap-2 text-sm text-slate-800">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.color }}
              aria-hidden
            />
            <span className="capitalize">{p.name}:</span>
            <span className="font-semibold">{formatCurrency(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DashboardRevenueChart({ data }: { data: RevenueMetric[] }) {
  const chartData = data

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Revenue &amp; profit</h2>
      <p className="mt-1 text-sm text-slate-500">Last six months</p>
      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dashRevFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dashProfitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
              width={48}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#dashRevFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#4f46e5" }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="profit"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#dashProfitFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#9333ea" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
