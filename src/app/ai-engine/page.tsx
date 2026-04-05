"use client"

import { ActivePipelines } from "@/components/ai-engine/active-pipelines"
import { CostTrackingChart } from "@/components/ai-engine/cost-tracking-chart"
import { KpiRow } from "@/components/ai-engine/kpi-row"
import { ModelRegistryTable } from "@/components/ai-engine/model-registry-table"
import { dashboardStats, mockAIModels, mockPipelines, mockProjects } from "@/lib/mock-data"

export default function AiEnginePage() {
  const pipelineCount = mockPipelines.length
  const avgGenSeconds =
    mockPipelines.reduce((acc, p) => acc + p.totalTime, 0) / Math.max(mockPipelines.length, 1)

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Production Engine</h1>
          <p className="mt-1 text-slate-600">
            Model routing, pipeline monitoring, and cost optimization
          </p>
        </header>

        <KpiRow
          pipelineCount={pipelineCount}
          avgCostPerProject={dashboardStats.aiCostPerProject}
          modelUptimePercent={99.7}
          avgGenerationSeconds={avgGenSeconds}
        />

        <ActivePipelines pipelines={mockPipelines} />

        <ModelRegistryTable models={mockAIModels} />

        <CostTrackingChart models={mockAIModels} pipelines={mockPipelines} projects={mockProjects} />
      </div>
    </div>
  )
}
