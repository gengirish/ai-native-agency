"use client"

import { useMemo } from "react"
import type { AIModel, Pipeline, Project } from "@/types"
import { formatCurrencyPrecise } from "@/lib/utils"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const MODEL_COLORS = ["#10b981", "#f97316", "#a855f7", "#3b82f6", "#ec4899", "#06b6d4", "#64748b"]

type CostTrackingChartProps = {
  models: AIModel[]
  pipelines: Pipeline[]
  projects: Project[]
}

function buildChartRows(models: AIModel[], pipelines: Pipeline[], projects: Project[]) {
  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  return recent.map((p) => {
    const row: Record<string, string | number> = {
      project: p.title.length > 28 ? `${p.title.slice(0, 26)}…` : p.title,
    }
    for (const m of models) {
      row[m.id] = 0
    }

    const pipeline = pipelines.find((pl) => pl.projectId === p.id)
    if (pipeline) {
      for (const t of pipeline.tasks) {
        const key = t.modelId
        if (key in row && typeof row[key] === "number") {
          row[key] = (row[key] as number) + t.cost
        }
      }
    } else if (p.aiCost > 0) {
      const primary = models[0]?.id
      if (primary) row[primary] = (row[primary] as number) + p.aiCost
    }

    return row
  })
}

export function CostTrackingChart({ models, pipelines, projects }: CostTrackingChartProps) {
  const data = useMemo(
    () => buildChartRows(models, pipelines, projects),
    [models, pipelines, projects]
  )

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Cost by Model</h2>
        <p className="text-sm text-slate-500">AI spend attributed to each model across recent projects</p>
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" vertical={false} />
              <XAxis
                dataKey="project"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={56}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  formatCurrencyPrecise(typeof value === "number" ? value : Number(value)),
                  "Cost",
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {models.map((m, i) => (
                <Bar
                  key={m.id}
                  dataKey={m.id}
                  name={m.name}
                  stackId="cost"
                  fill={MODEL_COLORS[i % MODEL_COLORS.length]}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
