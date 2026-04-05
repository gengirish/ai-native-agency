"use client"

import type { AutonomyConfig } from "@/types"
import { formatPercent } from "@/lib/utils"
import { Bot, Eye, UserRound } from "lucide-react"

type AutonomyStatsRowProps = {
  configs: AutonomyConfig[]
}

export function AutonomyStatsRow({ configs }: AutonomyStatsRowProps) {
  const total = configs.length || 1
  const autonomous = configs.filter((c) => c.currentLevel === "autonomous").length
  const spot = configs.filter((c) => c.currentLevel === "spot_check").length
  const human = configs.filter((c) => c.currentLevel === "human_required").length

  const cards = [
    {
      title: "Autonomous tasks",
      count: autonomous,
      pct: autonomous / total,
      badge: "bg-emerald-100 text-emerald-800",
      icon: Bot,
      iconWrap: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Spot check tasks",
      count: spot,
      pct: spot / total,
      badge: "bg-amber-100 text-amber-900",
      icon: Eye,
      iconWrap: "bg-amber-50 text-amber-600",
    },
    {
      title: "Human required",
      count: human,
      pct: human / total,
      badge: "bg-rose-100 text-rose-800",
      icon: UserRound,
      iconWrap: "bg-rose-50 text-rose-600",
    },
  ] as const

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.iconWrap}`}
          >
            <c.icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{c.title}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-slate-900">{c.count}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.badge}`}>
                {formatPercent(c.pct)} of total
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
