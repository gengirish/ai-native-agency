"use client"

import type { ExpertAssignment, ProjectType } from "@/types"
import { ArrowRight, ChevronRight } from "lucide-react"
import { cn, getPriorityColor } from "@/lib/utils"

function formatProjectType(type: ProjectType): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function priorityDotClass(priority: ExpertAssignment["priority"]): string {
  const map: Record<ExpertAssignment["priority"], string> = {
    low: "bg-slate-400",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  }
  return map[priority] ?? "bg-slate-400"
}

function escalationBadgeClass(level: ExpertAssignment["escalationLevel"]): string {
  if (level === "senior") return "bg-orange-100 text-orange-800"
  if (level === "manual_required") return "bg-red-100 text-red-800"
  return "bg-slate-100 text-slate-700"
}

function escalationLabel(level: ExpertAssignment["escalationLevel"]): string {
  if (level === "manual_required") return "Manual"
  if (level === "senior") return "Senior"
  return "Standard"
}

type ExpertAssignmentCardProps = {
  assignment: ExpertAssignment
  selected: boolean
  onSelect: () => void
  onClaim: () => void
  onCompleteReview: () => void
  onEscalateToSenior: () => void
}

export function ExpertAssignmentCard({
  assignment: a,
  selected,
  onSelect,
  onClaim,
  onCompleteReview,
  onEscalateToSenior,
}: ExpertAssignmentCardProps) {
  const showQualityAfter = a.status === "completed" && a.qualityAfter > 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "w-full cursor-pointer rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md",
        selected
          ? "border-indigo-300 ring-2 ring-indigo-100"
          : "border-slate-200/80"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{a.projectTitle}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {formatProjectType(a.projectType)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 shrink-0 rounded-full", priorityDotClass(a.priority))}
                aria-hidden
              />
              <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium capitalize", getPriorityColor(a.priority))}>
                {a.priority}
              </span>
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                escalationBadgeClass(a.escalationLevel)
              )}
            >
              {escalationLabel(a.escalationLevel)}
            </span>
            <span className="text-slate-600">
              Expert: <span className="font-medium text-slate-800">{a.expertName}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Quality</span>
            <span className="tabular-nums font-medium text-slate-500">
              {a.qualityBefore.toFixed(1)}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span
              className={cn(
                "tabular-nums font-semibold",
                showQualityAfter ? "text-emerald-600" : "text-slate-400"
              )}
            >
              {showQualityAfter ? a.qualityAfter.toFixed(1) : "—"}
            </span>
            {a.status === "completed" && a.reviewTimeMinutes > 0 && (
              <span className="ml-2 text-slate-500">
                · {a.reviewTimeMinutes} min review
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-medium capitalize text-slate-600">
            {a.status.replaceAll("_", " ")}
          </span>
          {a.status === "queued" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClaim()
              }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Claim
            </button>
          )}
          {(a.status === "in_review" || a.status === "claimed") && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onCompleteReview()
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Complete Review
            </button>
          )}
          {a.status === "escalated" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEscalateToSenior()
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
            >
              Escalate to Senior
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end text-xs text-indigo-600">
        {selected ? "Refinement tools open" : "Select for refinement"}
        <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
      </div>
    </div>
  )
}
