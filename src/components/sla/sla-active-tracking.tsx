"use client"

import { SLACompliance, SLAStatus } from "@/types"
import { formatCurrency, cn } from "@/lib/utils"

type Props = {
  records: SLACompliance[]
}

const statusOrder: Record<SLAStatus, number> = {
  breached: 0,
  at_risk: 1,
  on_track: 2,
}

function tierBadgeClass(tier: SLACompliance["tier"]) {
  if (tier === "enterprise") return "bg-purple-100 text-purple-800 ring-1 ring-purple-200"
  if (tier === "professional") return "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200"
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
}

function statusBadgeClass(status: SLAStatus) {
  if (status === "on_track") return "bg-emerald-100 text-emerald-800"
  if (status === "at_risk") return "bg-amber-100 text-amber-900"
  return "bg-rose-100 text-rose-800"
}

function statusLabel(status: SLAStatus) {
  if (status === "on_track") return "On track"
  if (status === "at_risk") return "At risk"
  return "Breached"
}

function barClass(status: SLAStatus) {
  if (status === "on_track") return "bg-emerald-500"
  if (status === "at_risk") return "bg-amber-500"
  return "bg-rose-500"
}

function sortedRecords(records: SLACompliance[]) {
  return [...records].sort((a, b) => {
    const d = statusOrder[a.status] - statusOrder[b.status]
    if (d !== 0) return d
    return a.projectTitle.localeCompare(b.projectTitle)
  })
}

export function SLAActiveTracking({ records }: Props) {
  const list = sortedRecords(records)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Active SLA tracking</h2>
      <div className="flex flex-col gap-4">
        {list.map((r) => {
          const pct = r.targetHours > 0 ? Math.min(100, (r.actualHours / r.targetHours) * 100) : 0
          const over = r.actualHours > r.targetHours
          const displayPct = over ? 100 : pct

          return (
            <article
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{r.projectTitle}</h3>
                  <p className="text-sm text-slate-600">{r.clientName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      tierBadgeClass(r.tier),
                    )}
                  >
                    {r.tier}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusBadgeClass(r.status))}>
                    {statusLabel(r.status)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">{r.metric}</p>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>
                    {r.actualHours}h / {r.targetHours}h target
                  </span>
                  <span>{over ? "Over budget" : `${pct.toFixed(0)}% of window used`}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all", barClass(r.status))}
                    style={{ width: `${displayPct}%` }}
                  />
                </div>
              </div>

              {r.creditIssued > 0 && (
                <p className="mt-3 text-sm text-slate-600">
                  Credits issued:{" "}
                  <span className="font-semibold text-slate-900">{formatCurrency(r.creditIssued)}</span>
                </p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
