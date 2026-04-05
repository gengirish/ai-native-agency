"use client"

import { cn, formatRelativeTime } from "@/lib/utils"
import { AlertOctagon, AlertTriangle, CircleDollarSign } from "lucide-react"

type EventType = "breach" | "near_miss" | "credit"

type TimelineEvent = {
  id: string
  at: string
  projectTitle: string
  summary: string
  resolution: string
  type: EventType
}

const events: TimelineEvent[] = [
  {
    id: "e1",
    at: "2026-04-04T09:15:00Z",
    projectTitle: "TechFlow Logo Redesign",
    summary: "Revision turnaround exceeded 24h SLA by 4 hours",
    resolution: "Automatic credit issued per Professional tier policy",
    type: "breach",
  },
  {
    id: "e2",
    at: "2026-04-03T16:40:00Z",
    projectTitle: "TechFlow Product Demo",
    summary: "Final delivery at 83% of 24h window — escalation notified",
    resolution: "Expert pod reassigned; delivery completed within SLA",
    type: "near_miss",
  },
  {
    id: "e3",
    at: "2026-04-01T11:00:00Z",
    projectTitle: "Lumina Holiday Ads",
    summary: "Enterprise first-draft clock at 87.5% utilization",
    resolution: "No action — remained on track",
    type: "near_miss",
  },
  {
    id: "e4",
    at: "2026-03-28T14:22:00Z",
    projectTitle: "Northwind Pitch Deck",
    summary: "Starter tier final delivery breached by 6h",
    resolution: "Client upgraded to Professional; goodwill credit applied",
    type: "breach",
  },
  {
    id: "e5",
    at: "2026-03-25T10:05:00Z",
    projectTitle: "TechFlow Logo Redesign",
    summary: "Credit ledger: 1 SLA credit posted",
    resolution: "Applied to next invoice automatically",
    type: "credit",
  },
]

function typeMeta(type: EventType) {
  if (type === "breach")
    return {
      label: "Breach",
      icon: AlertOctagon,
      row: "border-rose-200 bg-rose-50/50",
      dot: "bg-rose-500",
      iconWrap: "bg-rose-100 text-rose-700",
    }
  if (type === "near_miss")
    return {
      label: "Near miss",
      icon: AlertTriangle,
      row: "border-amber-200 bg-amber-50/40",
      dot: "bg-amber-500",
      iconWrap: "bg-amber-100 text-amber-800",
    }
  return {
    label: "Credit issued",
    icon: CircleDollarSign,
    row: "border-emerald-200 bg-emerald-50/40",
    dot: "bg-emerald-500",
    iconWrap: "bg-emerald-100 text-emerald-800",
  }
}

export function SLABreachTimeline() {
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Breach history &amp; alert log</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ol className="relative space-y-0 border-l border-slate-200 pl-8">
          {sorted.map((ev) => {
            const meta = typeMeta(ev.type)
            const Icon = meta.icon
            return (
              <li key={ev.id} className="relative pb-8 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white",
                    meta.dot,
                  )}
                />
                <div
                  className={cn(
                    "ml-2 rounded-xl border p-4 shadow-sm",
                    meta.row,
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", meta.iconWrap)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {meta.label}
                      </span>
                    </div>
                    <time className="text-xs tabular-nums text-slate-500" dateTime={ev.at}>
                      {formatRelativeTime(ev.at)}
                    </time>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{ev.projectTitle}</p>
                  <p className="mt-1 text-sm text-slate-700">{ev.summary}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Resolution: </span>
                    {ev.resolution}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
