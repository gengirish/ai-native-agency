"use client"

import type { AutonomyConfig, AutonomyLevel } from "@/types"
import { cn, formatPercent } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { laneCardClass, laneSurfaceClass, LEVEL_ORDER } from "./autonomy-level-styles"

const LANE_META: Record<
  AutonomyLevel,
  { title: string; subtitle: string; accent: string }
> = {
  autonomous: {
    title: "Autonomous",
    subtitle: "Ship with minimal oversight",
    accent: "text-emerald-700",
  },
  spot_check: {
    title: "Spot check",
    subtitle: "Sample review before scale",
    accent: "text-amber-800",
  },
  human_required: {
    title: "Human required",
    subtitle: "Expert-in-the-loop",
    accent: "text-rose-800",
  },
}

function TrendGlyph({ trend }: { trend: AutonomyConfig["trend"] }) {
  if (trend === "improving") {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-600" title="Improving">
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </span>
    )
  }
  if (trend === "declining") {
    return (
      <span className="inline-flex items-center text-rose-600" title="Declining">
        <ArrowDown className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-slate-400" title="Stable">
      <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
    </span>
  )
}

type AutonomyLanesProps = {
  configs: AutonomyConfig[]
}

export function AutonomyLanes({ configs }: AutonomyLanesProps) {
  const byLevel = LEVEL_ORDER.reduce(
    (acc, level) => {
      acc[level] = configs.filter((c) => c.currentLevel === level)
      return acc
    },
    {} as Record<AutonomyLevel, AutonomyConfig[]>
  )

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Autonomy level map</h2>
          <p className="text-sm text-slate-600">
            Task types level up from human oversight toward full automation
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ArrowUp className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
          <span>Improving confidence</span>
        </div>
      </div>

      <div className="relative space-y-3">
        <div
          className="pointer-events-none absolute left-[7.5rem] top-4 bottom-4 hidden w-px bg-gradient-to-b from-emerald-300/50 via-amber-300/40 to-rose-300/50 md:block"
          aria-hidden
        />
        <div className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-emerald-600">Up</span>
            <div className="h-16 w-0 border-l border-dashed border-slate-300" />
            <span className="text-rose-600">Start</span>
          </div>
        </div>

        {[...LEVEL_ORDER].reverse().map((level) => {
          const meta = LANE_META[level]
          const items = byLevel[level]
          return (
            <div
              key={level}
              className={cn(
                "relative rounded-xl border p-4 md:pl-36",
                laneSurfaceClass(level)
              )}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 md:absolute md:left-4 md:top-1/2 md:mb-0 md:w-28 md:-translate-y-1/2 md:flex-col md:items-start">
                <span className={cn("text-xs font-bold uppercase tracking-wide", meta.accent)}>
                  {meta.title}
                </span>
                <span className="text-[11px] leading-tight text-slate-500">{meta.subtitle}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "min-w-[200px] flex-1 rounded-xl border p-4 transition-shadow sm:max-w-[280px] sm:flex-none",
                      laneCardClass(level)
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold leading-tight text-slate-900">{c.taskLabel}</p>
                      <TrendGlyph trend={c.trend} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <dt className="text-slate-500">Confidence</dt>
                        <dd className="font-semibold tabular-nums text-slate-900">
                          {formatPercent(c.confidenceScore)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Completed</dt>
                        <dd className="font-semibold tabular-nums text-slate-900">
                          {c.totalCompleted}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-slate-500">Revision rate</dt>
                        <dd className="font-semibold tabular-nums text-slate-900">
                          {formatPercent(c.revisionRate)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="py-2 text-sm italic text-slate-400">No task types in this lane</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
