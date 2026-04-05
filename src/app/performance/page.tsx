"use client"

import { PerformanceHeader } from "@/components/performance/performance-header"
import { PerformanceKpiRow } from "@/components/performance/performance-kpi-row"
import { PerformanceByChannelChart } from "@/components/performance/performance-by-channel-chart"
import { RoiLeaderboard } from "@/components/performance/roi-leaderboard"
import { ChannelBreakdownCards } from "@/components/performance/channel-breakdown-cards"
import { DeliverablePerformanceTable } from "@/components/performance/deliverable-performance-table"
import { AiVsTraditionalCard } from "@/components/performance/ai-vs-traditional-card"
import { mockPerformanceMetrics } from "@/lib/mock-data"

export default function PerformancePage() {
  const metrics = mockPerformanceMetrics

  return (
    <div className="flex flex-col gap-6 p-8">
      <PerformanceHeader />
      <PerformanceKpiRow metrics={metrics} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PerformanceByChannelChart metrics={metrics} />
        </div>
        <div className="xl:col-span-2">
          <RoiLeaderboard metrics={metrics} />
        </div>
      </div>

      <ChannelBreakdownCards metrics={metrics} />
      <DeliverablePerformanceTable metrics={metrics} />
      <AiVsTraditionalCard />
    </div>
  )
}
