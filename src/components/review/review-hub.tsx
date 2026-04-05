"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { mockDeliverables, mockProjects, mockReviews } from "@/lib/mock-data"
import type { Review, ReviewComment, ReviewStatus, UserRole } from "@/types"
import { cn } from "@/lib/utils"
import { ReviewQueue } from "./review-queue"
import { ReviewDetailPanel } from "./review-detail-panel"

type FilterTab = "all" | "pending" | "approved" | "revision_requested"

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "revision_requested", label: "Revision Requested" },
]

const COMMENT_AUTHOR = "Alex Rivera"
const COMMENT_AUTHOR_ROLE: UserRole = "admin"

export function ReviewHub() {
  const [reviews, setReviews] = useState<Review[]>(() =>
    mockReviews.map((r) => ({ ...r, comments: r.comments.map((c) => ({ ...c })) })),
  )
  const [filter, setFilter] = useState<FilterTab>("all")
  const [selectedId, setSelectedId] = useState<string | null>(() => mockReviews[0]?.id ?? null)

  const projectsById = useMemo(() => new Map(mockProjects.map((p) => [p.id, p])), [])
  const deliverablesById = useMemo(() => new Map(mockDeliverables.map((d) => [d.id, d])), [])

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews
    return reviews.filter((r) => r.status === filter)
  }, [reviews, filter])

  useEffect(() => {
    setSelectedId((current) => {
      if (current && filteredReviews.some((r) => r.id === current)) return current
      return filteredReviews[0]?.id ?? null
    })
  }, [filteredReviews])

  const selectedReview = useMemo(
    () => (selectedId ? reviews.find((r) => r.id === selectedId) ?? null : null),
    [reviews, selectedId],
  )

  const projectDeliverables = useMemo(() => {
    if (!selectedReview) return []
    return mockDeliverables.filter((d) => d.projectId === selectedReview.projectId)
  }, [selectedReview])

  const updateReview = useCallback((id: string, patch: Partial<Review>) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  const appendComment = useCallback((reviewId: string, comment: ReviewComment) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, comments: [...r.comments, comment] } : r)),
    )
  }, [])

  const deliverable = selectedReview ? deliverablesById.get(selectedReview.deliverableId) : undefined
  const project = selectedReview ? projectsById.get(selectedReview.projectId) : undefined

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Review Hub</h1>
        <p className="mt-1 text-slate-600">Review, comment, and approve deliverables</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50",
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-h-0 w-full lg:w-[60%] lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Review queue</h2>
          <ReviewQueue
            reviews={filteredReviews}
            projectsById={projectsById}
            deliverablesById={deliverablesById}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[40%] lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Review detail</h2>
          <ReviewDetailPanel
            review={selectedReview}
            project={project}
            deliverable={deliverable}
            projectDeliverables={projectDeliverables}
            onRatingChange={(value) => {
              if (selectedReview) updateReview(selectedReview.id, { rating: value })
            }}
            onStatusAction={(status) => {
              if (selectedReview) updateReview(selectedReview.id, { status })
            }}
            onAppendComment={(comment) => {
              if (selectedReview) appendComment(selectedReview.id, comment)
            }}
            commentAuthor={COMMENT_AUTHOR}
            commentAuthorRole={COMMENT_AUTHOR_ROLE}
          />
        </div>
      </div>
    </div>
  )
}
