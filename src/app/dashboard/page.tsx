"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, Cpu, FolderKanban, MessageSquare, PieChart } from "lucide-react"

import { RequireRole } from "@/components/auth/require-role"
import { DashboardActivityFeed } from "@/components/dashboard/dashboard-activity-feed"
import { DashboardCostBreakdown } from "@/components/dashboard/dashboard-cost-breakdown"
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards"
import { DashboardProjectsTable } from "@/components/dashboard/dashboard-projects-table"
import { DashboardRevenueChart } from "@/components/dashboard/dashboard-revenue-chart"
import { EmptyState } from "@/components/ui/empty-state"
import { useAuth } from "@/lib/auth/context"
import {
  type DashboardStats,
  getCostBreakdown,
  getDashboardStats,
  getExpertAssignments,
  getProjects,
  getRevenueMetrics,
  getReviews,
} from "@/lib/api"
import type { CostBreakdown, ExpertAssignment, Project, RevenueMetric, Review } from "@/types"

export default function DashboardPage() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric[]>([])
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([])
  const [expertAssignments, setExpertAssignments] = useState<ExpertAssignment[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const [
          statsData,
          projectsData,
          revenueData,
          costData,
          assignmentsData,
          reviewsData,
        ] = await Promise.all([
          getDashboardStats(),
          getProjects(),
          getRevenueMetrics(),
          getCostBreakdown(),
          getExpertAssignments(),
          getReviews(),
        ])
        if (!cancelled) {
          setStats(statsData)
          setProjects(projectsData)
          setRevenueMetrics(revenueData)
          setCostBreakdown(costData)
          setExpertAssignments(assignmentsData)
          setReviews(reviewsData)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status !== "delivered"),
    [projects]
  )

  const activityEmpty =
    expertAssignments.length === 0 && reviews.length === 0

  return (
    <RequireRole permission="dashboard:view">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : (
        <div className="space-y-6 p-8">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">Agency performance at a glance</p>
          </header>

          {stats ? (
            <DashboardKpiCards
              monthlyRevenue={stats.monthlyRevenue}
              revenueGrowth={stats.revenueGrowth}
              activeProjects={stats.activeProjects}
              avgMargin={stats.avgMargin}
              avgQualityScore={stats.avgQualityScore}
              totalProjects={stats.totalProjects}
              activeClients={stats.activeClients}
            />
          ) : null}

          {revenueMetrics.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Revenue &amp; profit</h2>
              <p className="mt-1 text-sm text-slate-500">Last six months</p>
              <div className="mt-6">
                <EmptyState
                  icon={BarChart3}
                  title="No revenue data yet"
                  description="Connect your billing or import metrics to see trends here."
                />
              </div>
            </div>
          ) : (
            <DashboardRevenueChart data={revenueMetrics} />
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              {activeProjects.length === 0 ? (
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Active projects</h2>
                  <p className="mt-1 text-sm text-slate-500">In progress and awaiting delivery</p>
                  <div className="mt-6">
                    <EmptyState
                      icon={FolderKanban}
                      title="No active projects"
                      description="Projects that are not delivered will show up in this table."
                    />
                  </div>
                </div>
              ) : (
                <DashboardProjectsTable projects={activeProjects} />
              )}
            </div>
            <div className="space-y-6">
              {activityEmpty ? (
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Expert work and reviews</p>
                  <div className="mt-6">
                    <EmptyState
                      icon={MessageSquare}
                      title="No recent activity"
                      description="Expert assignments and client reviews will appear here."
                    />
                  </div>
                </div>
              ) : (
                <DashboardActivityFeed
                  assignments={expertAssignments}
                  reviews={reviews}
                />
              )}
              {costBreakdown.length === 0 ? (
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Cpu className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">AI cost breakdown</h2>
                      <p className="mt-1 text-sm text-slate-500">Spend by category this period</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <EmptyState
                      icon={PieChart}
                      title="No cost data"
                      description="AI usage costs by category will be summarized here."
                    />
                  </div>
                </div>
              ) : (
                <DashboardCostBreakdown items={costBreakdown} />
              )}
            </div>
          </div>
        </div>
      )}
    </RequireRole>
  )
}
