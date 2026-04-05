"use client"

import { useMemo } from "react"
import type { PublishingJob, PublishingStatus } from "@/types"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { CHANNEL_LABELS } from "./channel-styles"

type TimelineEntry = {
  id: string
  label: string
  sub: string
  at: Date
  kind: "live" | "scheduled" | "draft" | "other"
  hasWhen: boolean
}

function entryKind(status: PublishingStatus): TimelineEntry["kind"] {
  if (status === "live") return "live"
  if (status === "scheduled") return "scheduled"
  if (status === "draft") return "draft"
  return "other"
}

function markerClass(kind: TimelineEntry["kind"]): string {
  switch (kind) {
    case "live":
      return "border-green-500 bg-green-500"
    case "scheduled":
      return "border-blue-500 bg-blue-500"
    case "draft":
      return "border-slate-300 bg-slate-200"
    default:
      return "border-purple-400 bg-purple-400"
  }
}

type Props = {
  jobs: PublishingJob[]
}

export function DistributionTimeline({ jobs }: Props) {
  const entries = useMemo(() => {
    const list: TimelineEntry[] = jobs.map((j) => {
      const iso = j.publishedAt ?? j.scheduledAt
      const hasWhen = Boolean(iso)
      const at = iso ? new Date(iso) : new Date(0)
      const kind = entryKind(j.status)
      const when =
        j.publishedAt != null
          ? `Published ${formatDate(j.publishedAt)}`
          : j.scheduledAt != null
            ? `Scheduled ${formatDate(j.scheduledAt)}`
            : "Draft — not scheduled"
      return {
        id: j.id,
        label: j.projectTitle,
        sub: `${CHANNEL_LABELS[j.channel]} · ${when}`,
        at,
        kind,
        hasWhen,
      }
    })
    list.sort((a, b) => {
      if (a.hasWhen !== b.hasWhen) return a.hasWhen ? -1 : 1
      return a.at.getTime() - b.at.getTime()
    })
    return list
  }, [jobs])

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">
        Distribution timeline
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        When deliverables went live or are planned
      </p>

      <div className="relative mt-6 pl-8">
        <div
          className="absolute bottom-2 left-[11px] top-2 w-px bg-slate-200"
          aria-hidden
        />
        <ul className="space-y-6">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span
                className={cn(
                  "absolute left-[-22px] top-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm",
                  markerClass(e.kind)
                )}
              />
              <p className="font-medium text-slate-900">{e.label}</p>
              <p className="text-xs text-slate-500">{e.sub}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
