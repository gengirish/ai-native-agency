"use client"

import { AnalyticsClientRevenueTable } from "@/components/analytics/analytics-client-revenue-table"
import { AnalyticsCostDonut } from "@/components/analytics/analytics-cost-donut"
import { AnalyticsKpiRow } from "@/components/analytics/analytics-kpi-row"
import { AnalyticsMarginTrendChart } from "@/components/analytics/analytics-margin-trend-chart"
import { AnalyticsMomGrowth } from "@/components/analytics/analytics-mom-growth"
import { AnalyticsProjectTypesChart } from "@/components/analytics/analytics-project-types-chart"
import { AnalyticsRevenueProfitChart } from "@/components/analytics/analytics-revenue-profit-chart"
import {
  dashboardStats,
  mockCostBreakdown,
  mockProjects,
  mockRevenueMetrics,
} from "@/lib/mock-data"

export default function AnalyticsPage() {
  const latest = mockRevenueMetrics[mockRevenueMetrics.length - 1]
  const activeClients = latest?.clients ?? dashboardStats.activeClients

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-1 text-slate-600">
          Revenue, margins, costs, and business intelligence
        </p>
      </header>

      <AnalyticsKpiRow
        totalRevenue={dashboardStats.totalRevenue}
        monthlyRevenue={dashboardStats.monthlyRevenue}
        revenueGrowth={dashboardStats.revenueGrowth}
        avgMargin={dashboardStats.avgMargin}
        totalProjects={dashboardStats.totalProjects}
        activeClients={activeClients}
      />

      <AnalyticsRevenueProfitChart data={mockRevenueMetrics} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <AnalyticsMarginTrendChart data={mockRevenueMetrics} />
          <AnalyticsProjectTypesChart projects={mockProjects} />
          <AnalyticsClientRevenueTable projects={mockProjects} />
        </div>
        <div className="space-y-6">
          <AnalyticsCostDonut items={mockCostBreakdown} />
          <AnalyticsMomGrowth metrics={mockRevenueMetrics} />
        </div>
      </div>
    </div>
  )
}
