"use client"

import type { Lead, LeadStatus } from "@/types"
import { cn } from "@/lib/utils"
import { PIPELINE_STATUSES, STATUS_LABELS, STATUS_TOP_BORDER } from "./constants"
import { LeadCard } from "./lead-card"

type KanbanBoardProps = {
  leads: Lead[]
  selectedLeadId: string | null
  onSelectLead: (id: string | null) => void
}

export function KanbanBoard({
  leads,
  selectedLeadId,
  onSelectLead,
}: KanbanBoardProps) {
  const byStatus = PIPELINE_STATUSES.reduce<Record<LeadStatus, Lead[]>>(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status)
      return acc
    },
    {} as Record<LeadStatus, Lead[]>
  )

  return (
    <div className="rounded-2xl bg-slate-100 p-4 sm:p-6">
      <div className="flex gap-4 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-x-visible">
        {PIPELINE_STATUSES.map((status) => {
          const columnLeads = byStatus[status]
          const isWon = status === "won"
          const isLost = status === "lost"
          return (
            <div
              key={status}
              className={cn(
                "flex w-[min(100%,280px)] shrink-0 flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 shadow-sm lg:min-w-[240px]",
                isWon && "bg-emerald-50/60 ring-1 ring-emerald-200/60",
                isLost && "bg-red-50/40 opacity-95 ring-1 ring-red-200/50"
              )}
            >
              <div
                className={cn(
                  "rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm",
                  "border-t-4",
                  STATUS_TOP_BORDER[status]
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {STATUS_LABELS[status]}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {columnLeads.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {columnLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selectedLeadId === lead.id}
                    onClick={() =>
                      onSelectLead(
                        selectedLeadId === lead.id ? null : lead.id
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
