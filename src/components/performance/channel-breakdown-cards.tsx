"use client"

import type { PerformanceMetric, PublishingChannel } from "@/types"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import {
  CHANNEL_BG_SOFT,
  CHANNEL_BAR_COLORS,
  CHANNEL_ICONS,
  CHANNEL_LABELS,
} from "./channel-styles"
import { formatCompactNumber } from "./format-metric"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

function aggregateByChannel(metrics: PerformanceMetric[]) {
  const map = new Map<
    PublishingChannel,
    {
      impressions: number
      clicks: number
      conversions: number
      spend: number
      roiSum: number
      count: number
    }
  >()
  for (const m of metrics) {
    const cur = map.get(m.channel) ?? {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
      roiSum: 0,
      count: 0,
    }
    cur.impressions += m.impressions
    cur.clicks += m.clicks
    cur.conversions += m.conversions
    cur.spend += m.spend
    cur.roiSum += m.roi
    cur.count += 1
    map.set(m.channel, cur)
  }
  return Array.from(map.entries())
    .map(([channel, v]) => ({
      channel,
      impressions: v.impressions,
      clicks: v.clicks,
      conversions: v.conversions,
      spend: v.spend,
      roi: v.count > 0 ? v.roiSum / v.count : 0,
      ctr: v.impressions > 0 ? v.clicks / v.impressions : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions)
}

function sparkFromTotal(total: number) {
  const n = 7
  const weights = [0.12, 0.11, 0.13, 0.14, 0.15, 0.17, 0.18]
  return weights.map((w, i) => ({
    i: String(i + 1),
    v: Math.max(1, Math.round(total * w * (0.92 + (i % 3) * 0.04))),
  }))
}

export function ChannelBreakdownCards({
  metrics,
}: {
  metrics: PerformanceMetric[]
}) {
  const rows = aggregateByChannel(metrics)

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Channel Breakdown
        </h2>
        <p className="text-sm text-slate-500">
          Totals and engagement by publishing channel
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => {
          const Icon = CHANNEL_ICONS[row.channel]
          const accent = CHANNEL_BAR_COLORS[row.channel]
          const spark = sparkFromTotal(row.impressions)

          return (
            <div
              key={row.channel}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border",
                    CHANNEL_BG_SOFT[row.channel]
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Channel
                  </p>
                  <p className="font-semibold text-slate-900">
                    {CHANNEL_LABELS[row.channel]}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <div>
                  <dt className="text-slate-500">Impressions</dt>
                  <dd className="font-medium text-slate-900">
                    {formatCompactNumber(row.impressions)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Clicks</dt>
                  <dd className="font-medium text-slate-900">
                    {row.clicks.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">CTR</dt>
                  <dd className="font-medium text-slate-900">
                    {formatPercent(row.ctr)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Conversions</dt>
                  <dd className="font-medium text-slate-900">
                    {row.conversions}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Spend</dt>
                  <dd className="font-medium text-slate-900">
                    {formatCurrency(row.spend)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">ROI</dt>
                  <dd className="font-semibold text-emerald-700">
                    {row.roi.toFixed(1)}x
                  </dd>
                </div>
              </dl>

              <div className="mt-4 h-14 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spark} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="i" hide />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm">
                            {Number(payload[0].value).toLocaleString()}
                          </div>
                        ) : null
                      }
                    />
                    <Bar dataKey="v" fill={accent} radius={[3, 3, 0, 0]} maxBarSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
