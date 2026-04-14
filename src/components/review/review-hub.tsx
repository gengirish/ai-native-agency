"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  addReviewComment,
  getDeliverables,
  getProjects,
  getReviews,
  updateReview as apiUpdateReview,
} from "@/lib/api"
import { useAuth } from "@/lib/auth/context"
import type { Deliverable, Project, Review, ReviewComment, UserRole } from "@/types"
import { cn } from "@/lib/utils"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { ReviewQueue } from "./review-queue"
import { ReviewDetailPanel } from "./review-detail-panel"

type FilterTab = "all" | "pending" | "approved" | "revision_requested"

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "revision_requested", label: "Revision Requested" },
]

export function ReviewHub() {
  const { user } = useAuth()
  const commentAuthor = user?.name ?? "You"
  const commentAuthorRole: UserRole = user?.role ?? "expert"

  const [reviews, setReviews] = useState<Review[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterTab>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(t)
  }, [error])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [r, p, d] = await Promise.all([
          getReviews(),
          getProjects(),
          getDeliverables(),
        ])
        if (!cancelled) {
          setReviews(r.map((rev) => ({ ...rev, comments: rev.comments.map((c) => ({ ...c })) })))
          setProjects(p)
          setDeliverables(d)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])
  const deliverablesById = useMemo(
    () => new Map(deliverables.map((d) => [d.id, d])),
    [deliverables],
  )

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
    return deliverables.filter((d) => d.projectId === selectedReview.projectId)
  }, [selectedReview, deliverables])

  const updateReview = useCallback((id: string, patch: Partial<Review>) => {
    let previous: Review | null = null
    setReviews((prev) => {
      const current = prev.find((r) => r.id === id)
      if (current) {
        previous = { ...current, comments: current.comments.map((c) => ({ ...c })) }
      }
      return prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    })

    const apiPatch: { status?: string; rating?: number } = {}
    if (patch.status !== undefined) apiPatch.status = patch.status
    if (patch.rating !== undefined) apiPatch.rating = patch.rating
    if (Object.keys(apiPatch).length === 0) return

    void (async () => {
      const updated = await apiUpdateReview(id, apiPatch)
      if (updated === null && previous) {
        setReviews((prev) => prev.map((r) => (r.id === id ? previous! : r)))
        setError("Could not update the review. Please try again.")
      }
    })()
  }, [])

  const appendComment = useCallback((reviewId: string, comment: ReviewComment) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, comments: [...r.comments, comment] } : r)),
    )
    void (async () => {
      const res = await addReviewComment(reviewId, { content: comment.content })
      if (res === null) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, comments: r.comments.filter((c) => c.id !== comment.id) }
              : r,
          ),
        )
        setError("Could not add your comment. Please try again.")
      }
    })()
  }, [])

  const deliverable = selectedReview ? deliverablesById.get(selectedReview.deliverableId) : undefined
  const project = selectedReview ? projectsById.get(selectedReview.projectId) : undefined

  return (
    <RequireRole permission="review:view">
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Review Hub</h1>
          <p className="mt-1 text-slate-600">Review, comment, and approve deliverables</p>
        </header>

        {error ? (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No reviews pending"
            description="Deliverables awaiting review will appear here."
          />
        ) : (
          <>
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
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Review queue
                </h2>
                <ReviewQueue
                  reviews={filteredReviews}
                  projectsById={projectsById}
                  deliverablesById={deliverablesById}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
              <div className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[40%] lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Review detail
                </h2>
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
                  commentAuthor={commentAuthor}
                  commentAuthorRole={commentAuthorRole}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </RequireRole>
  )
}
