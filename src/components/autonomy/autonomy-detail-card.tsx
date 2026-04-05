"use client"

import type { AutonomyConfig } from "@/types"
import { cn, formatDate, formatPercent } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { ConfidenceRing } from "./confidence-ring"
import {
  levelBadgeClass,
  levelLabel,
  nextLevelProgress,
} from "./autonomy-level-styles"

function TrendRow({ trend }: { trend: AutonomyConfig["trend"] }) {
  if (trend === "improving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        Improving
      </span>
    )
  }
  if (trend === "declining") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600">
        <ArrowDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        Declining
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
      <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      Stable
    </span>
  )
}

type AutonomyDetailCardProps = {
  config: AutonomyConfig
}

export function AutonomyDetailCard({ config }: AutonomyDetailCardProps) {
  const { label, pct } = nextLevelProgress(config.currentLevel, config.confidenceScore)

  return (
    <article className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{config.taskLabel}</h3>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                levelBadgeClass(config.currentLevel)
              )}
            >
              {levelLabel(config.currentLevel)}
            </span>
          </div>
          <TrendRow trend={config.trend} />
          {config.projectedAutonomyDate && (
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Projected autonomy: </span>
              {formatDate(config.projectedAutonomyDate)}
            </p>
          )}
        </div>
        <ConfidenceRing confidence={config.confidenceScore} className="shrink-0 self-center sm:self-start" />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
            {config.totalCompleted}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Success rate</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
            {formatPercent(config.successRate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Revision rate</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
            {formatPercent(config.revisionRate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg quality</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
            {config.avgQualityScore.toFixed(1)} / 5
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{label}</span>
          <span className="tabular-nums text-slate-500">{pct.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              config.currentLevel === "autonomous" && "bg-emerald-500",
              config.currentLevel === "spot_check" && "bg-amber-500",
              config.currentLevel === "human_required" && "bg-rose-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </article>
  )
}
