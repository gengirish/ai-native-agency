import type { LucideIcon } from "lucide-react"
import type { Benchmark } from "@/types"
import { BenchmarkMetricCard } from "./benchmark-metric-card"

type BenchmarkCategorySectionProps = {
  title: string
  icon: LucideIcon
  benchmarks: Benchmark[]
}

export function BenchmarkCategorySection({
  title,
  icon: Icon,
  benchmarks,
}: BenchmarkCategorySectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {benchmarks.map((b) => (
          <BenchmarkMetricCard key={b.id} benchmark={b} />
        ))}
      </div>
    </section>
  )
}
