"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"
import { ordinalPercentile } from "./benchmarks-utils"

export type RadarDatum = { category: string; percentile: number }

type BenchmarksRadarChartProps = {
  data: RadarDatum[]
  className?: string
}

function RadarTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: RadarDatum }[]
}) {
  if (!active || !payload?.[0]) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-slate-900">{row.category}</p>
      <p className="text-indigo-600 tabular-nums">
        {ordinalPercentile(row.percentile)} (avg)
      </p>
    </div>
  )
}

export function BenchmarksRadarChart({ data, className }: BenchmarksRadarChartProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8",
        className
      )}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Strength profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Average percentile by category — where your AI-native model leads.
        </p>
      </div>
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Your agency"
              dataKey="percentile"
              stroke="#4f46e5"
              fill="#6366f1"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
