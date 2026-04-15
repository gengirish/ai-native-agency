"use client"

import type { Deliverable, Project, Review } from "@/types"
import { cn, formatRelativeTime } from "@/lib/utils"
import { Star } from "lucide-react"
import { formatReviewStatusLabel, getReviewStatusBadgeClass } from "./review-helpers"

type ReviewQueueProps = {
  reviews: Review[]
  projectsById: Map<string, Project>
  deliverablesById: Map<string, Deliverable>
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ReviewQueue({
  reviews,
  projectsById,
  deliverablesById,
  selectedId,
  onSelect,
}: ReviewQueueProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        No reviews match this filter.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const project = projectsById.get(review.projectId)
        const deliverable = deliverablesById.get(review.deliverableId)
        const title = project?.title ?? "Unknown project"
        const deliverableTitle = deliverable?.title ?? "Unknown deliverable"
        const version = deliverable?.version ?? "—"
        const selected = review.id === selectedId

        return (
          <button
            key={review.id}
            type="button"
            onClick={() => onSelect(review.id)}
            className={cn(
              "w-full rounded-xl border-2 bg-white p-4 text-left shadow-sm transition-all duration-200 cursor-pointer",
              selected
                ? "border-indigo-500 ring-1 ring-indigo-500/20 shadow-md"
                : "border-transparent ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
                <p className="mt-0.5 font-semibold text-slate-900">{deliverableTitle}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Version {version}
                  <span className="mx-2 text-slate-300">·</span>
                  {review.reviewerName}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getReviewStatusBadgeClass(review.status),
                )}
              >
                {formatReviewStatusLabel(review.status)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{formatRelativeTime(review.createdAt)}</span>
              {review.rating > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                  {review.rating}/5
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
