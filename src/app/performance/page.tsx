"use client"

import { useEffect, useState } from "react"
import { PerformanceHeader } from "@/components/performance/performance-header"
import { PerformanceKpiRow } from "@/components/performance/performance-kpi-row"
import { PerformanceByChannelChart } from "@/components/performance/performance-by-channel-chart"
import { RoiLeaderboard } from "@/components/performance/roi-leaderboard"
import { ChannelBreakdownCards } from "@/components/performance/channel-breakdown-cards"
import { DeliverablePerformanceTable } from "@/components/performance/deliverable-performance-table"
import { AiVsTraditionalCard } from "@/components/performance/ai-vs-traditional-card"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { getPerformanceMetrics } from "@/lib/api"
import type { PerformanceMetric } from "@/types"

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getPerformanceMetrics()
        if (!cancelled) setMetrics(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <RequireRole permission="performance:view">
      <div className="flex flex-col gap-6 p-8">
        <PerformanceHeader />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : metrics.length === 0 ? (
          <EmptyState
            title="No performance data"
            description="Performance metrics will appear once deliverables are published."
          />
        ) : (
          <>
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
          </>
        )}
      </div>
    </RequireRole>
  )
}
