"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { RequireRole } from "@/components/auth/require-role"
import { ExpertPerformanceSummary } from "@/components/expert/expert-performance-summary"
import { ExpertQueueManagement } from "@/components/expert/expert-queue-management"
import { ExpertRefinementPanel } from "@/components/expert/expert-refinement-panel"
import { ExpertStatsRow } from "@/components/expert/expert-stats-row"
import { EmptyState } from "@/components/ui/empty-state"
import { getExpertAssignments } from "@/lib/api"
import type { ExpertAssignment } from "@/types"

function bumpQuality(before: number): number {
  const delta = 0.2 + Math.random() * 0.25
  return Math.min(5, Math.round((before + delta) * 10) / 10)
}

export default function ExpertPage() {
  const [assignments, setAssignments] = useState<ExpertAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
  }, [])

  const completeReview = useCallback((id: string) => {
    const now = new Date().toISOString()
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        if (a.status !== "in_review" && a.status !== "claimed") return a
        const start = a.claimedAt ? new Date(a.claimedAt).getTime() : Date.now()
        const rawMins = Math.round((Date.now() - start) / 60000)
        const minutes = rawMins > 0 ? Math.min(rawMins, 180) : 12
        return {
          ...a,
          status: "completed",
          completedAt: now,
          reviewTimeMinutes: minutes,
          qualityAfter: bumpQuality(a.qualityBefore),
        }
      })
    )
  }, [])

  const escalateToSenior = useCallback((id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id || a.status !== "escalated") return a
        return {
          ...a,
          escalationLevel: "manual_required",
        }
      })
    )
  }, [])

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
