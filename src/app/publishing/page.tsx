"use client"

import { useEffect, useMemo, useState } from "react"
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
            <ConnectedChannelsRow configs={channelConfigs} />
            <PublishingQueue jobs={jobs} />
            <QuickPublishPanel
              channelConfigs={channelConfigs}
              deliverableOptions={deliverableOptions}
            />
            <PublishingMetricsSummary jobs={jobs} />
            <DistributionTimeline jobs={jobs} />
          </>
        )}
      </div>
    </RequireRole>
  )
}
