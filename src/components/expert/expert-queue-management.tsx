"use client"

import type { ExpertAssignment } from "@/types"
import { ExpertAssignmentCard } from "@/components/expert/expert-assignment-card"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"

export type QueueTab = "all" | "queued" | "in_review" | "completed" | "escalated"

const TABS: { id: QueueTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "queued", label: "Queued" },
  { id: "in_review", label: "In Review" },
  { id: "completed", label: "Completed" },
  { id: "escalated", label: "Escalated" },
]

type ExpertQueueManagementProps = {
  assignments: ExpertAssignment[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onClaim: (id: string) => void
  onCompleteReview: (id: string) => void
  onEscalateToSenior: (id: string) => void
}

function matchesTab(a: ExpertAssignment, tab: QueueTab): boolean {
  if (tab === "all") return true
  if (tab === "queued") return a.status === "queued"
  if (tab === "in_review")
    return a.status === "in_review" || a.status === "claimed"
  if (tab === "completed") return a.status === "completed"
  if (tab === "escalated") return a.status === "escalated"
  return true
}

export function ExpertQueueManagement({
  assignments,
  selectedId,
  onSelect,
  onClaim,
  onCompleteReview,
  onEscalateToSenior,
}: ExpertQueueManagementProps) {
  const [tab, setTab] = useState<QueueTab>("all")

  const filtered = useMemo(
    () => assignments.filter((a) => matchesTab(a, tab)),
    [assignments, tab]
  )

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Queue Management</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Filter and act on expert assignments
        </p>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              tab === t.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-sm text-slate-500">
            No assignments in this view
          </p>
        ) : (
          filtered.map((a) => (
            <ExpertAssignmentCard
              key={a.id}
              assignment={a}
              selected={selectedId === a.id}
              onSelect={() => onSelect(selectedId === a.id ? null : a.id)}
              onClaim={() => onClaim(a.id)}
              onCompleteReview={() => onCompleteReview(a.id)}
              onEscalateToSenior={() => onEscalateToSenior(a.id)}
            />
          ))
        )}
      </div>
    </section>
  )
}
