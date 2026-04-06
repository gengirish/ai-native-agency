"use client"

import { useState, useEffect } from "react"
import { ActivePipelines } from "@/components/ai-engine/active-pipelines"
import { CostTrackingChart } from "@/components/ai-engine/cost-tracking-chart"
import { KpiRow } from "@/components/ai-engine/kpi-row"
import { ModelRegistryTable } from "@/components/ai-engine/model-registry-table"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import {
  getAIModels,
  getDashboardStats,
  getPipelines,
  getProjects,
  type DashboardStats,
} from "@/lib/api"
import type { AIModel, Pipeline, Project } from "@/types"

const emptyDashboardStats: DashboardStats = {
  totalRevenue: 0,
  monthlyRevenue: 0,
  revenueGrowth: 0,
  activeProjects: 0,
  totalProjects: 0,
  avgMargin: 0,
  avgQualityScore: 0,
  avgTurnaround: 0,
  totalClients: 0,
  activeClients: 0,
  pipelineValue: 0,
  expertUtilization: 0,
  autonomousRate: 0,
  aiCostPerProject: 0,
}

export default function AiEnginePage() {
  const [models, setModels] = useState<AIModel[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(emptyDashboardStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [m, p, pr, stats] = await Promise.all([
          getAIModels(),
          getPipelines(),
          getProjects(),
          getDashboardStats(),
        ])
        if (!cancelled) {
          setModels(m)
          setPipelines(p)
          setProjects(pr)
          setDashboardStats(stats)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const pipelineCount = pipelines.length
  const avgGenSeconds =
    pipelines.reduce((acc, p) => acc + p.totalTime, 0) / Math.max(pipelines.length, 1)

  return (
    <RequireRole permission="ai-engine:view">
      <div className="p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Production Engine</h1>
            <p className="mt-1 text-slate-600">
              Model routing, pipeline monitoring, and cost optimization
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
          ) : (
            <>
              <KpiRow
                pipelineCount={pipelineCount}
                avgCostPerProject={dashboardStats.aiCostPerProject}
                modelUptimePercent={99.7}
                avgGenerationSeconds={avgGenSeconds}
              />

              {pipelines.length === 0 ? (
                <EmptyState
                  title="No active pipelines"
                  description="Pipeline runs will show here once projects start generating."
                />
              ) : (
                <ActivePipelines pipelines={pipelines} />
              )}

              {models.length === 0 ? (
                <EmptyState
                  title="No models registered"
                  description="Connect providers and register models to see routing and cost data."
                />
              ) : (
                <ModelRegistryTable models={models} />
              )}

              {projects.length === 0 || models.length === 0 ? (
                <EmptyState
                  title="No cost data yet"
                  description="Recent projects and registered models are needed to chart AI spend by model."
                />
              ) : (
                <CostTrackingChart models={models} pipelines={pipelines} projects={projects} />
              )}
            </>
          )}
        </div>
      </div>
    </RequireRole>
  )
}
