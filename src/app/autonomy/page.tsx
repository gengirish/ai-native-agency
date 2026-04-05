"use client"

import { AutonomyCostSavings } from "@/components/autonomy/autonomy-cost-savings"
import { AutonomyDetailGrid } from "@/components/autonomy/autonomy-detail-grid"
import { AutonomyHeader } from "@/components/autonomy/autonomy-header"
import { AutonomyLanes } from "@/components/autonomy/autonomy-lanes"
import { AutonomyStatsRow } from "@/components/autonomy/autonomy-stats-row"
import { AutonomyTrendChart } from "@/components/autonomy/autonomy-trend-chart"
import { mockAutonomyConfigs } from "@/lib/mock-data"

export default function AutonomyPage() {
  const configs = mockAutonomyConfigs

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <AutonomyHeader />
        <AutonomyStatsRow configs={configs} />
        <AutonomyLanes configs={configs} />
        <AutonomyDetailGrid configs={configs} />
        <AutonomyTrendChart configs={configs} />
        <AutonomyCostSavings configs={configs} />
      </div>
    </div>
  )
}
