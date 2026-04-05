"use client"

import { useMemo } from "react"
import { ConnectedChannelsRow } from "@/components/publishing/connected-channels-row"
import { DistributionTimeline } from "@/components/publishing/distribution-timeline"
import { PublishingHeader } from "@/components/publishing/publishing-header"
import { PublishingMetricsSummary } from "@/components/publishing/publishing-metrics-summary"
import { PublishingQueue } from "@/components/publishing/publishing-queue"
import { QuickPublishPanel } from "@/components/publishing/quick-publish-panel"
import { mockChannelConfigs, mockPublishingJobs } from "@/lib/mock-data"

export default function PublishingPage() {
  const deliverableOptions = useMemo(() => {
    const byId = new Map<
      string,
      { deliverableId: string; projectTitle: string }
    >()
    for (const j of mockPublishingJobs) {
      if (!byId.has(j.deliverableId)) {
        byId.set(j.deliverableId, {
          deliverableId: j.deliverableId,
          projectTitle: j.projectTitle,
        })
      }
    }
    return Array.from(byId.values())
  }, [])

  return (
    <div className="flex flex-col gap-6 p-8">
      <PublishingHeader />
      <ConnectedChannelsRow configs={mockChannelConfigs} />
      <PublishingQueue jobs={mockPublishingJobs} />
      <QuickPublishPanel
        channelConfigs={mockChannelConfigs}
        deliverableOptions={deliverableOptions}
      />
      <PublishingMetricsSummary jobs={mockPublishingJobs} />
      <DistributionTimeline jobs={mockPublishingJobs} />
    </div>
  )
}
