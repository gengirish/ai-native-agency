"use client"

import { useState, useEffect } from "react"
import { Award, Gauge, TrendingUp, Wallet } from "lucide-react"
import { RequireRole } from "@/components/auth/require-role"
import { BenchmarkCategorySection } from "@/components/benchmarks/benchmark-category-section"
import { BenchmarksCompetitiveMoat } from "@/components/benchmarks/benchmarks-competitive-moat"
import { BenchmarksHeader } from "@/components/benchmarks/benchmarks-header"
import { BenchmarksInsightsPanel } from "@/components/benchmarks/benchmarks-insights-panel"
import { BenchmarksRadarChart } from "@/components/benchmarks/benchmarks-radar-chart"
import { BenchmarksScoreCard } from "@/components/benchmarks/benchmarks-score-card"
import {
  averagePercentile,
  categoryRadarData,
  deriveInsights,
  groupByCategory,
  moatPillarScores,
} from "@/components/benchmarks/benchmarks-utils"
import { EmptyState } from "@/components/ui/empty-state"
import { getBenchmarks } from "@/lib/api"
import type { Benchmark } from "@/types"

const CATEGORY_ORDER = ["Speed", "Cost", "Quality", "Scale"] as const

const CATEGORY_ICONS = {
  Speed: Gauge,
  Cost: Wallet,
  Quality: Award,
  Scale: TrendingUp,
} as const

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getBenchmarks()
      .then((data) => {
        if (!cancelled) setBenchmarks(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const overall = averagePercentile(benchmarks)
  const grouped = groupByCategory(benchmarks, [...CATEGORY_ORDER])
  const radarData = categoryRadarData(benchmarks, [...CATEGORY_ORDER])
  const insights = deriveInsights(benchmarks)
  const moatRaw = moatPillarScores(benchmarks, [...CATEGORY_ORDER])
  const moatPillars = moatRaw.map((m) => ({
    key: m.category,
    label:
      m.category === "Speed"
        ? "Speed advantage"
        : m.category === "Cost"
          ? "Cost advantage"
          : m.category === "Quality"
            ? "Quality score"
            : "Scale advantage",
    you: m.you,
    industry: m.industry,
  }))

  return (
    <RequireRole permission="benchmarks:view">
      <div className="flex flex-col gap-6 p-8">
        <BenchmarksHeader />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : benchmarks.length === 0 ? (
          <EmptyState
            title="No benchmarks yet"
            description="Benchmarks will populate as your agency processes projects."
          />
        ) : (
          <>
            <BenchmarksScoreCard scorePercentile={overall} />

            {[...grouped.entries()].map(([category, list]) => (
              <BenchmarkCategorySection
                key={category}
                title={category}
                icon={CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                benchmarks={list}
              />
            ))}

            <div className="grid gap-6 lg:grid-cols-2">
              <BenchmarksRadarChart data={radarData} />
              <BenchmarksInsightsPanel insights={insights} />
            </div>

            <BenchmarksCompetitiveMoat pillars={moatPillars} />
          </>
        )}
      </div>
    </RequireRole>
  )
}
