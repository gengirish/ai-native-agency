"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Project, ProjectType } from "@/types"

const TYPE_LABELS: Record<ProjectType, string> = {
  logo_design: "Logo",
  social_media: "Social",
  brand_identity: "Brand ID",
  marketing_collateral: "Collateral",
  video_ad: "Video ad",
  legal_document: "Legal",
  blog_content: "Blog",
  email_campaign: "Email",
  ad_creative: "Ad creative",
}

function aggregateByType(projects: Project[]) {
  const map = new Map<string, number>()
  for (const p of projects) {
    map.set(p.type, (map.get(p.type) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([type, count]) => ({
      type,
      label: TYPE_LABELS[type as ProjectType] ?? type,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

function BarTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { label: string; count: number } }[]
}) {
  if (!active || !payload?.[0]) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-slate-900">{row.label}</p>
      <p className="text-sm text-violet-700 tabular-nums">
        {row.count} project{row.count === 1 ? "" : "s"}
      </p>
    </div>
  )
}

export function AnalyticsProjectTypesChart({ projects }: { projects: Project[] }) {
  const chartData = aggregateByType(projects)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Project type distribution</h2>
      <p className="mt-1 text-sm text-slate-500">Count by category in dataset</p>
      <div className="mt-6 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="analyticsBarGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="label"
              width={88}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.06)" }} />
            <Bar
              dataKey="count"
              name="Projects"
              radius={[0, 6, 6, 0]}
              fill="url(#analyticsBarGrad)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
