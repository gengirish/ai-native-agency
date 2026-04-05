"use client"

import { SLATier } from "@/types"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

type Props = {
  tiers: SLATier[]
}

function tierLabel(tier: SLATier["tier"]) {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

function tierHeaderClass(tier: SLATier["tier"]) {
  if (tier === "enterprise") {
    return "bg-gradient-to-b from-purple-950 to-purple-900 text-white ring-2 ring-purple-400/60"
  }
  if (tier === "professional") {
    return "bg-indigo-600 text-white"
  }
  return "bg-slate-700 text-white"
}

function formatHours(h: number) {
  return `${h}h`
}

function maxRev(n: number) {
  return n === -1 ? "Unlimited" : String(n)
}

const rows: { label: string; get: (t: SLATier) => string }[] = [
  { label: "First draft turnaround", get: (t) => formatHours(t.firstDraftHours) },
  { label: "Final delivery", get: (t) => formatHours(t.finalDeliveryHours) },
  { label: "Revision turnaround", get: (t) => formatHours(t.revisionTurnaroundHours) },
  { label: "Max revisions", get: (t) => maxRev(t.maxRevisions) },
  { label: "Guaranteed credits (if breached)", get: (t) => String(t.guaranteedCredits) },
  { label: "Penalty %", get: (t) => `${t.penaltyPercent}%` },
]

export function SLATiersComparison({ tiers }: Props) {
  const starter = tiers.find((t) => t.tier === "starter")
  const pro = tiers.find((t) => t.tier === "professional")
  const ent = tiers.find((t) => t.tier === "enterprise")

  const ordered = [starter, pro, ent].filter(Boolean) as SLATier[]

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">SLA tiers comparison</h2>
          <p className="mt-1 text-sm text-slate-600">
            First draft:{" "}
            <span className="font-medium text-slate-800">
              {starter && ent ? `${formatHours(starter.firstDraftHours)} → ${formatHours(ent.firstDraftHours)}` : "—"}
            </span>{" "}
            — AI-native velocity at every level
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
          <Zap className="h-3.5 w-3.5" />
          Enterprise = tightest SLA
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                Metric
              </th>
              {ordered.map((t) => (
                <th
                  key={t.tier}
                  className={cn(
                    "border-b border-slate-200 px-4 py-3 text-center font-semibold",
                    tierHeaderClass(t.tier),
                    t.tier === "enterprise" && "relative",
                  )}
                >
                  {t.tier === "enterprise" && (
                    <span className="absolute right-2 top-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/90">
                      Best
                    </span>
                  )}
                  {tierLabel(t.tier)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                {ordered.map((t) => (
                  <td
                    key={t.tier}
                    className={cn(
                      "px-4 py-3 text-center tabular-nums text-slate-800",
                      t.tier === "enterprise" && "bg-purple-50/80 font-medium text-purple-950",
                    )}
                  >
                    {row.get(t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="rounded-md bg-slate-100 px-2 py-1">Starter — slate</span>
        <span className="rounded-md bg-indigo-100 px-2 py-1 text-indigo-800">Professional — indigo</span>
        <span className="rounded-md bg-purple-100 px-2 py-1 text-purple-900">Enterprise — purple</span>
      </div>
    </section>
  )
}
