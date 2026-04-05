"use client"

import type { ProactiveSuggestion, SuggestionStatus } from "@/types"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { projectTypeLabel } from "./project-type-label"
import { Loader2 } from "lucide-react"

const STATUS_BADGE: Record<
  SuggestionStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
  },
  rejected: {
    label: "Dismissed",
    className: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-200",
  },
  generated: {
    label: "Generated",
    className: "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200",
  },
}

function daysUntil(dateIso: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const exp = new Date(dateIso)
  exp.setHours(0, 0, 0, 0)
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function expiryTextClass(days: number): string {
  if (days < 0) return "text-red-600 font-medium"
  if (days < 3) return "text-red-600 font-medium"
  if (days < 7) return "text-amber-600 font-medium"
  return "text-slate-600"
}

interface SuggestionCardProps {
  suggestion: ProactiveSuggestion
  generationProgress: number
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
}

export function SuggestionCard({
  suggestion: s,
  generationProgress,
  onAccept,
  onDismiss,
}: SuggestionCardProps) {
  const badge = STATUS_BADGE[s.status]
  const relevancePct = Math.round(Math.min(1, Math.max(0, s.relevanceScore)) * 100)
  const dLeft = daysUntil(s.expiresAt)
  const isRejected = s.status === "rejected"
  const isAccepted = s.status === "accepted"
  const showActions = s.status === "pending" || s.status === "generated"

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm transition-opacity",
        isRejected && "border-slate-200 opacity-60 grayscale",
        isAccepted && "border-green-200 border-l-4 border-l-green-500 bg-green-50/40",
        !isAccepted && !isRejected && "border-slate-200/80"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
              badge.className
            )}
          >
            {badge.label}
          </span>
          <span className="text-sm font-medium text-slate-900">{s.clientName}</span>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {projectTypeLabel(s.type)}
          </span>
        </div>
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-tight tracking-tight text-slate-900">
        {s.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>

      <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/80 py-3 pl-4 pr-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Why we suggest this
        </p>
        <blockquote className="mt-2 border-l-2 border-violet-300 pl-3 text-sm italic text-slate-700">
          {s.reasoning}
        </blockquote>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Trend source</span>
        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
          {s.trendSource}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Relevance</span>
          <span className="tabular-nums text-slate-900">{relevancePct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-500"
            style={{ width: `${relevancePct}%` }}
            role="progressbar"
            aria-valuenow={relevancePct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-6 border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Estimated value
          </p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900">
            {formatCurrency(s.estimatedValue)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Expires
          </p>
          <p className={cn("mt-0.5 text-sm", expiryTextClass(dLeft))}>
            {formatDate(s.expiresAt)}
            {dLeft >= 0 && (
              <span className="ml-1 text-slate-500">
                ({dLeft === 0 ? "today" : `${dLeft}d left`})
              </span>
            )}
            {dLeft < 0 && (
              <span className="ml-1 text-red-600">(expired)</span>
            )}
          </p>
        </div>
      </div>

      {isAccepted && (
        <div className="mt-6 rounded-lg border border-green-200 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-800">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Generating project…
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-green-500 transition-[width] duration-300 ease-out"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onAccept(s.id)}
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
          >
            Accept &amp; generate
          </button>
          <button
            type="button"
            onClick={() => onDismiss(s.id)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Dismiss
          </button>
        </div>
      )}
    </article>
  )
}
