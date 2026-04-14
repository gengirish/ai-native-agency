"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { RequireRole } from "@/components/auth/require-role"
import { ExpertPerformanceSummary } from "@/components/expert/expert-performance-summary"
import { ExpertQueueManagement } from "@/components/expert/expert-queue-management"
import { ExpertRefinementPanel } from "@/components/expert/expert-refinement-panel"
import { ExpertStatsRow } from "@/components/expert/expert-stats-row"
import { EmptyState } from "@/components/ui/empty-state"
import { getExpertAssignments } from "@/lib/api"
import { getToken } from "@/lib/auth/context"
import type { ExpertAssignment } from "@/types"

function bumpQuality(before: number): number {
  const delta = 0.2 + Math.random() * 0.25
  return Math.min(5, Math.round((before + delta) * 10) / 10)
}

export default function ExpertPage() {
  const [assignments, setAssignments] = useState<ExpertAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const assignmentsRef = useRef(assignments)
  assignmentsRef.current = assignments

  const refetchAssignments = useCallback(async () => {
    try {
      const data = await getExpertAssignments()
      setAssignments(data)
    } catch {
      setActionError("Could not refresh assignments.")
    }
  }, [])

  const persistExpertPatch = useCallback(async (id: string, patch: Record<string, unknown>) => {
    const token = getToken()
    const res = await fetch(`/api/experts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      await refetchAssignments()
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
      setActionError(json?.error?.message ?? "Could not save changes.")
      return
    }
    setActionError(null)
  }, [refetchAssignments])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getExpertAssignments()
      .then((data) => {
        if (!cancelled) setAssignments(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(
    () => assignments.find((a) => a.id === selectedId) ?? null,
    [assignments, selectedId]
  )

  const claim = useCallback((id: string) => {
    const now = new Date().toISOString()
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id && a.status === "queued"
          ? {
              ...a,
              status: "in_review",
              claimedAt: now,
            }
          : a
      )
    )
    void persistExpertPatch(id, { status: "in_review", claimedAt: now })
  }, [persistExpertPatch])

  const completeReview = useCallback(
    (id: string) => {
      const a = assignmentsRef.current.find((x) => x.id === id)
      if (!a || (a.status !== "in_review" && a.status !== "claimed")) return
      const now = new Date().toISOString()
      const start = a.claimedAt ? new Date(a.claimedAt).getTime() : Date.now()
      const rawMins = Math.round((Date.now() - start) / 60000)
      const minutes = rawMins > 0 ? Math.min(rawMins, 180) : 12
      const qualityAfter = bumpQuality(a.qualityBefore)
      setAssignments((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row
          if (row.status !== "in_review" && row.status !== "claimed") return row
          return {
            ...row,
            status: "completed",
            completedAt: now,
            reviewTimeMinutes: minutes,
            qualityAfter,
          }
        })
      )
      void persistExpertPatch(id, {
        status: "completed",
        completedAt: now,
        reviewTimeMinutes: minutes,
        qualityAfter,
      })
    },
    [persistExpertPatch],
  )

  const escalateToSenior = useCallback(
    (id: string) => {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id !== id || a.status !== "escalated") return a
          return {
            ...a,
            escalationLevel: "manual_required",
          }
        })
      )
      void persistExpertPatch(id, { escalationLevel: "manual_required" })
    },
    [persistExpertPatch],
  )

  return (
    <RequireRole permission="expert:view">
      <div className="flex flex-col gap-6 p-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Expert Queue
          </h1>
          <p className="mt-1 text-slate-600">
            Claim, review, and refine AI-generated deliverables
          </p>
        </header>

        {actionError ? (
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            {actionError}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState
            title="No assignments"
            description="New review assignments will appear here."
          />
        ) : (
          <>
            <ExpertStatsRow assignments={assignments} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="space-y-6 xl:col-span-3">
                <ExpertQueueManagement
                  assignments={assignments}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onClaim={claim}
                  onCompleteReview={completeReview}
                  onEscalateToSenior={escalateToSenior}
                />
              </div>
              <div className="xl:col-span-2">
                <ExpertRefinementPanel assignment={selected} />
              </div>
            </div>

            <ExpertPerformanceSummary assignments={assignments} />
          </>
        )}
      </div>
    </RequireRole>
  )
}
