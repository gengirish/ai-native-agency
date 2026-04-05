"use client"

import {
  Building2,
  DollarSign,
  FolderKanban,
  Minus,
  Percent,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"

type TrendDir = "up" | "down" | "neutral"

function TrendRow({
  dir,
  label,
  sublabel,
}: {
  dir: TrendDir
  label: string
  sublabel?: string
}) {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
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

export function AnalyticsKpiRow({
  totalRevenue,
  monthlyRevenue,
  revenueGrowth,
  avgMargin,
  totalProjects,
  activeClients,
}: {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  avgMargin: number
  totalProjects: number
  activeClients: number
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Wallet className="size-5" aria-hidden />
          </span>
        </div>
        <TrendRow dir="up" label="Trailing 6 mo" sublabel="all clients" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(monthlyRevenue)}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <DollarSign className="size-5" aria-hidden />
          </span>
        </div>
        <TrendRow
          dir="up"
          label={`+${formatPercent(revenueGrowth)}`}
          sublabel="vs prior month"
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Avg Margin</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {formatPercent(avgMargin)}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Percent className="size-5" aria-hidden />
          </span>
        </div>
        <TrendRow dir="up" label="Improving" sublabel="cost efficiency" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Total Projects</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {totalProjects}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50/80 text-indigo-700">
            <FolderKanban className="size-5" aria-hidden />
          </span>
        </div>
        <TrendRow dir="up" label="Portfolio" sublabel="lifetime" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:col-span-2 xl:col-span-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Active Clients</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {activeClients}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50/80 text-violet-700">
            <Building2 className="size-5" aria-hidden />
          </span>
        </div>
        <TrendRow dir="up" label="Engaged" sublabel="this month" />
      </div>
    </div>
  )
}
