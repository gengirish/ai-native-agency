"use client"

import { useState, useEffect } from "react"
import { AnalyticsClientRevenueTable } from "@/components/analytics/analytics-client-revenue-table"
import { AnalyticsCostDonut } from "@/components/analytics/analytics-cost-donut"
import { AnalyticsKpiRow } from "@/components/analytics/analytics-kpi-row"
import { AnalyticsMarginTrendChart } from "@/components/analytics/analytics-margin-trend-chart"
import { AnalyticsMomGrowth } from "@/components/analytics/analytics-mom-growth"
import { AnalyticsProjectTypesChart } from "@/components/analytics/analytics-project-types-chart"
import { AnalyticsRevenueProfitChart } from "@/components/analytics/analytics-revenue-profit-chart"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import {
  getCostBreakdown,
  getDashboardStats,
  getProjects,
  getRevenueMetrics,
  type DashboardStats,
} from "@/lib/api"
import type { CostBreakdown, Project, RevenueMetric } from "@/types"

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

export default function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(emptyDashboardStats)
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric[]>([])
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [stats, revenue, costs, pr] = await Promise.all([
          getDashboardStats(),
          getRevenueMetrics(),
          getCostBreakdown(),
          getProjects(),
        ])
        if (!cancelled) {
          setDashboardStats(stats)
          setRevenueMetrics(revenue)
          setCostBreakdown(costs)
          setProjects(pr)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const latest = revenueMetrics[revenueMetrics.length - 1]
  const activeClients = latest?.clients ?? dashboardStats.activeClients

  const hasNoAnalyticsData =
    revenueMetrics.length === 0 && projects.length === 0 && costBreakdown.length === 0

  return (
    <RequireRole permission="analytics:view">
      <div className="space-y-6 p-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-1 text-slate-600">
            Revenue, margins, costs, and business intelligence
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <>
            <AnalyticsKpiRow
              totalRevenue={dashboardStats.totalRevenue}
              monthlyRevenue={dashboardStats.monthlyRevenue}
              revenueGrowth={dashboardStats.revenueGrowth}
              avgMargin={dashboardStats.avgMargin}
              totalProjects={dashboardStats.totalProjects}
              activeClients={activeClients}
            />

            {hasNoAnalyticsData ? (
              <EmptyState
                title="No analytics data"
                description="Revenue trends, project breakdowns, and cost allocation will appear as your workspace accumulates activity."
              />
            ) : (
              <>
                <AnalyticsRevenueProfitChart data={revenueMetrics} />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="space-y-6 xl:col-span-2">
                    <AnalyticsMarginTrendChart data={revenueMetrics} />
                    <AnalyticsProjectTypesChart projects={projects} />
                    <AnalyticsClientRevenueTable projects={projects} />
                  </div>
                  <div className="space-y-6">
                    <AnalyticsCostDonut items={costBreakdown} />
                    <AnalyticsMomGrowth metrics={revenueMetrics} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </RequireRole>
  )
}
