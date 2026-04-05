import type { Benchmark } from "@/types"
import { formatCurrency } from "@/lib/utils"

export function isLowerBetter(b: Benchmark): boolean {
  if (b.category === "Speed") return true
  if (b.category === "Cost" && b.metric.toLowerCase().includes("cost per")) return true
  return false
}

export function clamp01(n: number): number {
  return Math.min(100, Math.max(0, n))
}

export function getBarPositions(b: Benchmark): { you: number; industry: number; top: number } {
  const vals = [b.yourValue, b.industryAvg, b.topPerformer]
  const minV = Math.min(...vals)
  const maxV = Math.max(...vals)
  const span = maxV - minV || Math.max(maxV, 1) * 0.2
  const pad = span * 0.2
  const lo = Math.max(0, minV - pad)
  const hi = maxV + pad
  const range = hi - lo || 1

  if (isLowerBetter(b)) {
    const norm = (v: number) => clamp01(((hi - v) / range) * 100)
    return {
      you: norm(b.yourValue),
      industry: norm(b.industryAvg),
      top: norm(b.topPerformer),
    }
  }
  const norm = (v: number) => clamp01(((v - lo) / range) * 100)
  return {
    you: norm(b.yourValue),
    industry: norm(b.industryAvg),
    top: norm(b.topPerformer),
  }
}

export function ordinalPercentile(n: number): string {
  const rounded = Math.round(n)
  const v = rounded % 100
  const suffix =
    v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd"][rounded % 10] ?? "th"
  return `${rounded}${suffix} percentile`
}

export function formatBenchmarkValue(b: Benchmark): string {
  const { yourValue, unit } = b
  if (unit === "USD" || unit === "USD/mo") return formatCurrency(yourValue)
  if (unit === "%") return `${yourValue}%`
  if (unit === "minutes") return `${yourValue} min`
  if (unit === "hours") return `${yourValue} h`
  if (unit === "score") return `${yourValue}`
  if (unit === "projects") return `${yourValue}`
  return `${yourValue} ${unit}`
}

export function averagePercentile(benchmarks: Benchmark[]): number {
  if (!benchmarks.length) return 0
  return benchmarks.reduce((s, b) => s + b.percentile, 0) / benchmarks.length
}

export function groupByCategory(
  benchmarks: Benchmark[],
  order: string[]
): Map<string, Benchmark[]> {
  const map = new Map<string, Benchmark[]>()
  for (const b of benchmarks) {
    const list = map.get(b.category) ?? []
    list.push(b)
    map.set(b.category, list)
  }
  for (const [, list] of map) {
    list.sort((a, x) => a.metric.localeCompare(x.metric))
  }
  const sorted = new Map<string, Benchmark[]>()
  for (const cat of order) {
    const list = map.get(cat)
    if (list?.length) sorted.set(cat, list)
  }
  return sorted
}

export function categoryRadarData(benchmarks: Benchmark[], categories: string[]) {
  return categories.map((category) => {
    const inCat = benchmarks.filter((b) => b.category === category)
    const avg =
      inCat.reduce((s, b) => s + b.percentile, 0) / (inCat.length || 1)
    return { category, percentile: Math.round(avg * 10) / 10 }
  })
}

export function moatPillarScores(benchmarks: Benchmark[], categories: string[]) {
  return categories.map((category) => {
    const inCat = benchmarks.filter((b) => b.category === category)
    const you =
      inCat.reduce((s, b) => s + b.percentile, 0) / (inCat.length || 1)
    return {
      category,
      you: Math.round(you * 10) / 10,
      industry: 50,
    }
  })
}

export function deriveInsights(data: Benchmark[]): string[] {
  const insights: string[] = []
  const turnaround = data.find((b) => b.metric === "Total Project Turnaround")
  const brief = data.find((b) => b.metric === "Brief-to-First-Draft")
  if (turnaround && turnaround.industryAvg > 0) {
    const faster =
      ((turnaround.industryAvg - turnaround.yourValue) / turnaround.industryAvg) * 100
    insights.push(
      `Your turnaround time is ${faster.toFixed(1)}% faster than industry average`
    )
  } else if (brief && brief.industryAvg > 0) {
    const faster = ((brief.industryAvg - brief.yourValue) / brief.industryAvg) * 100
    insights.push(
      `Brief-to-first-draft is ${faster.toFixed(1)}% faster than the industry average`
    )
  }
  const margin = data.find((b) => b.metric === "Gross Margin")
  if (margin) {
    insights.push(
      `You achieve ${margin.yourValue}% margins vs industry ${margin.industryAvg}%`
    )
  }
  const projects = data.find((b) => b.metric === "Projects per Expert per Month")
  if (projects && projects.industryAvg > 0) {
    insights.push(
      `Each expert handles ${(projects.yourValue / projects.industryAvg).toFixed(1)}× more projects than traditional agencies`
    )
  }
  const cost = data.find((b) => b.metric === "Cost per Project")
  if (cost && cost.industryAvg > 0) {
    const save = ((cost.industryAvg - cost.yourValue) / cost.industryAvg) * 100
    insights.push(
      `Cost per project runs ${save.toFixed(1)}% below industry average while scaling output`
    )
  }
  const rev = data.find((b) => b.metric === "Revenue per Employee")
  if (rev && rev.industryAvg > 0) {
    const lift = ((rev.yourValue - rev.industryAvg) / rev.industryAvg) * 100
    insights.push(
      `Revenue per employee is ${lift.toFixed(0)}% above industry average`
    )
  }
  const nps = data.find((b) => b.metric.includes("NPS"))
  if (nps) {
    insights.push(
      `Client NPS (${nps.yourValue}) leads the industry benchmark (${nps.industryAvg}) by ${(nps.yourValue - nps.industryAvg).toFixed(0)} points`
    )
  }
  return insights.slice(0, 6)
}

export function percentileBadgeClass(percentile: number): string {
  if (percentile >= 90) return "bg-emerald-100 text-emerald-800 ring-emerald-200"
  if (percentile >= 75) return "bg-blue-100 text-blue-800 ring-blue-200"
  if (percentile >= 50) return "bg-amber-100 text-amber-800 ring-amber-200"
  return "bg-red-100 text-red-800 ring-red-200"
}
