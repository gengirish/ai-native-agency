"use client"

import type { Lead } from "@/types"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { CalendarClock, GripVertical } from "lucide-react"

type LeadCardProps = {
  lead: Lead
  selected: boolean
  onClick: () => void
}

export function LeadCard({ lead, selected, onClick }: LeadCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md",
        selected
          ? "border-indigo-400 ring-2 ring-indigo-100"
          : "border-slate-200"
      )}
    >
      <div className="flex gap-2">
        <span
          className="mt-0.5 cursor-grab text-slate-300 active:cursor-grabbing"
          aria-hidden
        >
          <GripVertical className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 font-semibold text-slate-900">{lead.company}</p>
            <span className="shrink-0 text-sm font-semibold text-slate-900">
              {formatCurrency(lead.value)}
            </span>
          </div>
          <p className="text-sm text-slate-600">{lead.contactName}</p>
          <p className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {lead.source}
          </p>
          <div className="space-y-1 text-xs text-slate-500">
            <p>Last contact {formatDate(lead.lastContactAt)}</p>
            {lead.nextFollowUp ? (
              <p className="flex items-center gap-1 text-slate-600">
                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                Follow-up {formatDate(lead.nextFollowUp)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  )
}
