"use client"

import type { AutonomyConfig } from "@/types"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seriesForConfig(config: AutonomyConfig): Record<string, string | number>[] {
  const end = config.confidenceScore * 100
  const spread = config.trend === "improving" ? 18 : config.trend === "declining" ? -12 : 8
  const h = hashId(config.id)
  return MONTHS.map((month, i) => {
    const t = i / (MONTHS.length - 1)
    const wobble = ((h >> (i * 3)) % 7) - 3
    const start = end - spread + (config.trend === "declining" ? spread * 1.2 : 0)
    let v = start + (end - start) * t + wobble * 0.4
    if (config.trend === "stable") v = end + (wobble * 0.25 - 1) * (1 - Math.abs(t - 0.5))
    v = Math.min(99, Math.max(52, v))
    if (i === MONTHS.length - 1) v = end
    return { month, [config.id]: Math.round(v * 10) / 10 }
  })
}

function mergeSeries(configs: AutonomyConfig[]) {
  const rows = MONTHS.map((month) => ({ month }))
  configs.forEach((c) => {
    const s = seriesForConfig(c)
    s.forEach((point, i) => {
      Object.assign(rows[i] as object, point)
    })
  })
  return rows
}

const COLORS = [
  "#059669",
  "#10b981",
  "#d97706",
  "#e11d48",
  "#f43f5e",
  "#be123c",
  "#f59e0b",
  "#047857",
]

type AutonomyTrendChartProps = {
  configs: AutonomyConfig[]
}

export function AutonomyTrendChart({ configs }: AutonomyTrendChartProps) {
  const data = mergeSeries(configs)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Confidence trend</h2>
      <p className="mt-1 text-sm text-slate-600">Six-month model confidence by task type</p>
      <div className="mt-4 h-[320px] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              domain={[50, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={44}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value ?? 0).toFixed(1)}%`,
                "Confidence",
              ]}
              labelClassName="text-slate-700"
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              formatter={(value) => {
                const c = configs.find((x) => x.id === value)
                return c?.taskLabel ?? value
              }}
            />
            {configs.map((c, i) => (
              <Line
                key={c.id}
                type="monotone"
                dataKey={c.id}
                name={c.id}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 2.5, strokeWidth: 1 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
