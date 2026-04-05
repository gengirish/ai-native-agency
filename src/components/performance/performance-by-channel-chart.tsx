"use client"

import type { PerformanceMetric, PublishingChannel } from "@/types"
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CHANNEL_BAR_COLORS, CHANNEL_LABELS } from "./channel-styles"

function aggregateByChannel(metrics: PerformanceMetric[]) {
  const map = new Map<
    PublishingChannel,
    { impressions: number; clicks: number; conversions: number }
  >()
  for (const m of metrics) {
    const cur = map.get(m.channel) ?? {
      impressions: 0,
      clicks: 0,
      conversions: 0,
    }
    cur.impressions += m.impressions
    cur.clicks += m.clicks
    cur.conversions += m.conversions
    map.set(m.channel, cur)
  }
  return Array.from(map.entries()).map(([channel, v]) => ({
    channel,
    name: CHANNEL_LABELS[channel],
    impressions: v.impressions,
    clicks: v.clicks,
    conversions: v.conversions,
  }))
}

export function PerformanceByChannelChart({
  metrics,
}: {
  metrics: PerformanceMetric[]
}) {
  const data = aggregateByChannel(metrics)

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Performance by Channel
        </h2>
        <p className="text-sm text-slate-500">
          Impressions (left axis) vs. clicks & conversions (right axis)
        </p>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1_000
                    ? `${(v / 1_000).toFixed(0)}K`
                    : String(v)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
              }}
              formatter={(value, name) => {
                const n = typeof value === "number" ? value : Number(value)
                return [
                  Number.isFinite(n) ? n.toLocaleString() : "—",
                  String(name ?? ""),
                ]
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="impressions"
              name="Impressions"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            >
              {data.map((d) => (
                <Cell
                  key={d.channel}
                  fill={CHANNEL_BAR_COLORS[d.channel]}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="clicks"
              name="Clicks"
              fill={CHANNEL_BAR_COLORS.linkedin}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              yAxisId="right"
              dataKey="conversions"
              name="Conversions"
              fill={CHANNEL_BAR_COLORS.meta_ads}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
