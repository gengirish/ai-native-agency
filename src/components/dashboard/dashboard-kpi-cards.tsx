"use client"

import {
  Activity,
  DollarSign,
  FolderKanban,
  Percent,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"

type TrendDir = "up" | "down" | "neutral"

function TrendPill({
  dir,
  label,
  sublabel,
}: {
  dir: TrendDir
  label: string
  sublabel?: string
}) {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Activity
  return (
    <div className="mt-3 flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
          dir === "up" && "bg-emerald-50 text-emerald-700",
          dir === "down" && "bg-rose-50 text-rose-700",
          dir === "neutral" && "bg-slate-100 text-slate-600"
        )}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </span>
      {sublabel ? <span className="text-slate-500">{sublabel}</span> : null}
    </div>
  )
}

export function DashboardKpiCards({
  monthlyRevenue,
  revenueGrowth,
  activeProjects,
  avgMargin,
  avgQualityScore,
  totalProjects,
  activeClients,
}: {
  monthlyRevenue: number
  revenueGrowth: number
  activeProjects: number
  avgMargin: number
  avgQualityScore: number
  totalProjects: number
  activeClients: number
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(monthlyRevenue)}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <DollarSign className="size-5" aria-hidden />
          </span>
        </div>
        <TrendPill
          dir="up"
          label={`+${formatPercent(revenueGrowth)}`}
          sublabel="vs prior month"
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Projects</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {activeProjects}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <FolderKanban className="size-5" aria-hidden />
          </span>
        </div>
        <TrendPill
          dir="neutral"
          label={`${totalProjects} total`}
          sublabel={`${activeClients} active clients`}
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Margin</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {formatPercent(avgMargin)}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Percent className="size-5" aria-hidden />
          </span>
        </div>
        <TrendPill dir="up" label="95th pctile" sublabel="vs industry" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Quality Score</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {avgQualityScore.toFixed(1)}
              <span className="text-lg font-normal text-slate-400">/5</span>
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
            <Activity className="size-5" aria-hidden />
          </span>
        </div>
        <TrendPill dir="up" label="Above target" sublabel="4.0 goal" />
      </div>
    </div>
  )
}
