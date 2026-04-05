"use client"

import type { AutonomyConfig, AutonomyLevel } from "@/types"
import { PiggyBank } from "lucide-react"

const EXPERT_HOURS_BY_LEVEL: Record<AutonomyLevel, number> = {
  human_required: 2.4,
  spot_check: 0.65,
  autonomous: 0.12,
}

const AUTONOMOUS_FLOOR = 0.12

function monthlyVolume(totalCompleted: number): number {
  return Math.max(2, Math.round(totalCompleted / 5))
}

function computeSavings(configs: AutonomyConfig[]): number {
  let total = 0
  for (const c of configs) {
    const vol = monthlyVolume(c.totalCompleted)
    const current = EXPERT_HOURS_BY_LEVEL[c.currentLevel] * vol
    const ifAuto = AUTONOMOUS_FLOOR * vol
    total += current - ifAuto
  }
  return Math.round(total * 10) / 10
}

type AutonomyCostSavingsProps = {
  configs: AutonomyConfig[]
}

export function AutonomyCostSavings({ configs }: AutonomyCostSavingsProps) {
  const hours = computeSavings(configs)

  return (
    <section className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <PiggyBank className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Cost savings calculator</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
              If every task type ran at full autonomy with the same monthly volume, you would reclaim
              roughly{" "}
              <span className="font-semibold tabular-nums text-emerald-800">{hours}</span> hours of
              expert review time per month compared to today&apos;s blended autonomy mix.
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-emerald-100 bg-white/90 px-5 py-4 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
            Estimated savings
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-700">{hours}</p>
          <p className="text-xs text-slate-500">expert hrs / month</p>
        </div>
      </div>
    </section>
  )
}
