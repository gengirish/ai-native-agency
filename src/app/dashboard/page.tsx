"use client"

import { DashboardActivityFeed } from "@/components/dashboard/dashboard-activity-feed"
import { DashboardCostBreakdown } from "@/components/dashboard/dashboard-cost-breakdown"
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards"
import { DashboardProjectsTable } from "@/components/dashboard/dashboard-projects-table"
import { DashboardRevenueChart } from "@/components/dashboard/dashboard-revenue-chart"
import {
  dashboardStats,
  mockCostBreakdown,
  mockExpertAssignments,
  mockProjects,
  mockReviews,
  mockRevenueMetrics,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const activeProjects = mockProjects.filter((p) => p.status !== "delivered")

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Agency performance at a glance</p>
      </header>

      <DashboardKpiCards
        monthlyRevenue={dashboardStats.monthlyRevenue}
        revenueGrowth={dashboardStats.revenueGrowth}
        activeProjects={dashboardStats.activeProjects}
        avgMargin={dashboardStats.avgMargin}
        avgQualityScore={dashboardStats.avgQualityScore}
        totalProjects={dashboardStats.totalProjects}
        activeClients={dashboardStats.activeClients}
      />

      <DashboardRevenueChart data={mockRevenueMetrics} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <DashboardProjectsTable projects={activeProjects} />
        </div>
        <div className="space-y-6">
          <DashboardActivityFeed
            assignments={mockExpertAssignments}
            reviews={mockReviews}
          />
          <DashboardCostBreakdown items={mockCostBreakdown} />
        </div>
      </div>
    </div>
  )
}
