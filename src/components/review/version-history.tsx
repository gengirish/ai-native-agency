"use client"

import type { Deliverable } from "@/types"
import { cn, formatDate, getStatusColor } from "@/lib/utils"

type VersionHistoryProps = {
  versions: Deliverable[]
  currentDeliverableId: string
}

export function VersionHistory({ versions, currentDeliverableId }: VersionHistoryProps) {
  const sorted = [...versions].sort((a, b) => b.version - a.version)

  if (sorted.length === 0) {
    return null
  }

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Version history</h3>
      <ul className="mt-3 space-y-2">
        {sorted.map((d) => {
          const isCurrent = d.id === currentDeliverableId
          return (
            <li
              key={d.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm",
                isCurrent ? "border-indigo-200 bg-indigo-50/50" : "border-slate-100 bg-slate-50/50",
              )}
            >
              <div>
                <span className="font-medium text-slate-800">v{d.version}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="text-slate-600">{d.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    getStatusColor(d.status),
                  )}
                >
                  {d.status.replace("_", " ")}
                </span>
                <time className="text-xs text-slate-500">{formatDate(d.createdAt)}</time>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
