"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ConnectedChannelsRow } from "@/components/publishing/connected-channels-row"
import { DistributionTimeline } from "@/components/publishing/distribution-timeline"
import { PublishingHeader } from "@/components/publishing/publishing-header"
import { PublishingMetricsSummary } from "@/components/publishing/publishing-metrics-summary"
import { PublishingQueue } from "@/components/publishing/publishing-queue"
import { QuickPublishPanel } from "@/components/publishing/quick-publish-panel"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { getChannelConfigs, getPublishingJobs } from "@/lib/api"
import type { ChannelConfig, PublishingJob } from "@/types"

export default function PublishingPage() {
  const [jobs, setJobs] = useState<PublishingJob[]>([])
  const [channelConfigs, setChannelConfigs] = useState<ChannelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [pubError, setPubError] = useState<string | null>(null)
  const [busyJobId, setBusyJobId] = useState<string | null>(null)

  const patchPublishingJob = useCallback(
    async (id: string, body: { status: string; scheduledAt?: string }) => {
      setPubError(null)
      try {
        const res = await fetch(`/api/publishing/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        const json = (await res.json().catch(() => null)) as
          | { data?: PublishingJob; error?: { message?: string } }
          | null
        if (!res.ok) {
          setPubError(json?.error?.message ?? "Could not update publishing job.")
          return false
        }
        if (json?.data) {
          setJobs((prev) => prev.map((j) => (j.id === id ? json.data! : j)))
        }
        return true
      } catch {
        setPubError("Network error while updating publishing.")
        return false
      }
    },
    [],
  )

  const patchCardJob = useCallback(
    async (id: string, body: { status: string; scheduledAt?: string }) => {
      setBusyJobId(id)
      try {
        return await patchPublishingJob(id, body)
      } finally {
        setBusyJobId(null)
      }
    },
    [patchPublishingJob],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [fetchedJobs, fetchedConfigs] = await Promise.all([
          getPublishingJobs(),
          getChannelConfigs(),
        ])
        if (!cancelled) {
          setJobs(fetchedJobs)
          setChannelConfigs(fetchedConfigs)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const deliverableOptions = useMemo(() => {
    const byId = new Map<
      string,
      { deliverableId: string; projectTitle: string }
    >()
    for (const j of jobs) {
      if (!byId.has(j.deliverableId)) {
        byId.set(j.deliverableId, {
          deliverableId: j.deliverableId,
          projectTitle: j.projectTitle,
        })
      }
    }
    return Array.from(byId.values())
  }, [jobs])

  return (
    <RequireRole permission="publishing:view">
      <div className="flex flex-col gap-6 p-8">
        <PublishingHeader />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : jobs.length === 0 && channelConfigs.length === 0 ? (
          <EmptyState
            title="No publishing jobs"
            description="Connect channels and schedule content to see jobs here."
          />
        ) : (
          <>
            {pubError ? (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                role="alert"
              >
                {pubError}
              </div>
            ) : null}
            <ConnectedChannelsRow configs={channelConfigs} />
            <PublishingQueue
              jobs={jobs}
              busyJobId={busyJobId}
              onPublishNow={(job) => void patchCardJob(job.id, { status: "live" })}
              onScheduleJob={(job, scheduledAtIso) =>
                void patchCardJob(job.id, { status: "scheduled", scheduledAt: scheduledAtIso })
              }
            />
            <QuickPublishPanel
              channelConfigs={channelConfigs}
              deliverableOptions={deliverableOptions}
              jobs={jobs}
              patchPublishingJob={patchPublishingJob}
            />
            <PublishingMetricsSummary jobs={jobs} />
            <DistributionTimeline jobs={jobs} />
          </>
        )}
      </div>
    </RequireRole>
  )
}
