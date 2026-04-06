"use client"

import { useState, useEffect } from "react"
import { AutonomyCostSavings } from "@/components/autonomy/autonomy-cost-savings"
import { AutonomyDetailGrid } from "@/components/autonomy/autonomy-detail-grid"
import { AutonomyHeader } from "@/components/autonomy/autonomy-header"
import { AutonomyLanes } from "@/components/autonomy/autonomy-lanes"
import { AutonomyStatsRow } from "@/components/autonomy/autonomy-stats-row"
import { AutonomyTrendChart } from "@/components/autonomy/autonomy-trend-chart"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { getAutonomyConfigs } from "@/lib/api"
import type { AutonomyConfig } from "@/types"

export default function AutonomyPage() {
  const [configs, setConfigs] = useState<AutonomyConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getAutonomyConfigs()
        if (!cancelled) setConfigs(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <RequireRole permission="autonomy:view">
      <div className="p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <AutonomyHeader />
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
          ) : configs.length === 0 ? (
            <EmptyState
              title="No autonomy configs"
              description="Autonomy levels will appear as projects are processed."
            />
          ) : (
            <>
              <AutonomyStatsRow configs={configs} />
              <AutonomyLanes configs={configs} />
              <AutonomyDetailGrid configs={configs} />
              <AutonomyTrendChart configs={configs} />
              <AutonomyCostSavings configs={configs} />
            </>
          )}
        </div>
      </div>
    </RequireRole>
  )
}
