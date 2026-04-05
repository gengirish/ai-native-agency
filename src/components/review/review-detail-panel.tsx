"use client"

import type { Deliverable, Project, Review, ReviewComment, ReviewStatus, UserRole } from "@/types"
import { cn, formatCurrencyPrecise, formatRelativeTime } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import { StarRating } from "./star-rating"
import { ReviewComments, createLocalComment } from "./review-comments"
import { VersionHistory } from "./version-history"
import { formatReviewStatusLabel, getReviewStatusBadgeClass } from "./review-helpers"

type ReviewDetailPanelProps = {
  review: Review | null
  project: Project | undefined
  deliverable: Deliverable | undefined
  projectDeliverables: Deliverable[]
  onRatingChange: (value: number) => void
  onStatusAction: (status: ReviewStatus) => void
  onAppendComment: (comment: ReviewComment) => void
  commentAuthor: string
  commentAuthorRole: UserRole
}

export function ReviewDetailPanel({
  review,
  project,
  deliverable,
  projectDeliverables,
  onRatingChange,
  onStatusAction,
  onAppendComment,
  commentAuthor,
  commentAuthorRole,
}: ReviewDetailPanelProps) {
  if (!review || !deliverable) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Select a review from the queue to see details.
      </div>
    )
  }

  const handleAddComment = (content: string) => {
    onAppendComment(createLocalComment(commentAuthor, commentAuthorRole, content))
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <ImageIcon className="h-14 w-14 opacity-60" strokeWidth={1.25} />
            <span className="text-sm font-medium">Deliverable preview</span>
            <span className="max-w-[90%] truncate px-2 text-xs text-slate-400">{deliverable.title}</span>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{project?.title ?? "Project"}</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">{deliverable.title}</h2>
              <p className="mt-1 text-sm text-slate-600">Version {deliverable.version}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                getReviewStatusBadgeClass(review.status),
              )}
            >
              {formatReviewStatusLabel(review.status)}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">AI model</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{deliverable.aiModel}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Generation cost</dt>
              <dd className="mt-0.5 font-medium text-slate-900">
                {formatCurrencyPrecise(deliverable.generationCost)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Quality score</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{deliverable.qualityScore.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Queued</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{formatRelativeTime(review.createdAt)}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onStatusAction("approved")}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onStatusAction("revision_requested")}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
            >
              Request revision
            </button>
            <button
              type="button"
              onClick={() => onStatusAction("rejected")}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Reject
            </button>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700">Rating</p>
            <div className="mt-2">
              <StarRating value={review.rating} onChange={onRatingChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <ReviewComments comments={review.comments} onAddComment={handleAddComment} />
      </div>

      <VersionHistory versions={projectDeliverables} currentDeliverableId={deliverable.id} />
    </div>
  )
}
