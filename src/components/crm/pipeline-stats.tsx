"use client"

import type { Lead } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, Users, Trophy, Percent } from "lucide-react"

function isActivePipeline(lead: Lead) {
  return lead.status !== "won" && lead.status !== "lost"
}

function startOfCurrentMonth(now: Date) {
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

const STATS_REFERENCE_NOW = new Date("2026-04-05T12:00:00Z")

export function computePipelineStats(leads: Lead[], now = STATS_REFERENCE_NOW) {
  const active = leads.filter(isActivePipeline)
  const pipelineValue = active.reduce((s, l) => s + l.value, 0)
  const activeCount = active.length

  const monthStart = startOfCurrentMonth(now)
  const wonThisMonth = leads.filter(
    (l) =>
      l.status === "won" &&
      new Date(l.lastContactAt) >= monthStart &&
      new Date(l.lastContactAt) <= now
  )
  const wonThisMonthValue = wonThisMonth.reduce((s, l) => s + l.value, 0)
  const wonThisMonthCount = wonThisMonth.length

  const wonTotal = leads.filter((l) => l.status === "won").length
  const lostTotal = leads.filter((l) => l.status === "lost").length
  const closed = wonTotal + lostTotal
  const conversionRate = closed > 0 ? wonTotal / closed : 0

  return {
    pipelineValue,
    activeCount,
    wonThisMonthCount,
    wonThisMonthValue,
    conversionRate,
    hasClosedDeals: closed > 0,
  }
}

type PipelineStatsProps = {
  leads: Lead[]
}

export function PipelineStatsRow({ leads }: PipelineStatsProps) {
  const stats = computePipelineStats(leads)
  const conversionDisplay = stats.hasClosedDeals
    ? `${Math.round(stats.conversionRate * 100)}%`
    : "—"

  const cards = [
    {
      title: "Pipeline Value",
      value: formatCurrency(stats.pipelineValue),
      sub: "Active opportunities",
      icon: TrendingUp,
      iconClass: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Leads",
      value: String(stats.activeCount),
      sub: "Excluding won & lost",
      icon: Users,
      iconClass: "text-indigo-600 bg-indigo-100",
    },
    {
      title: "Won This Month",
      value: String(stats.wonThisMonthCount),
      sub: formatCurrency(stats.wonThisMonthValue),
      icon: Trophy,
      iconClass: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Conversion Rate",
      value: conversionDisplay,
      sub: "Won ÷ (won + lost)",
      icon: Percent,
      iconClass: "text-amber-600 bg-amber-100",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{c.title}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
            </div>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.iconClass}`}
            >
              <c.icon className="h-5 w-5" aria-hidden />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
