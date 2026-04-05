import { GitBranch, DollarSign, Activity, Timer } from "lucide-react"
import { formatCurrencyPrecise } from "@/lib/utils"

type KpiRowProps = {
  pipelineCount: number
  avgCostPerProject: number
  modelUptimePercent: number
  avgGenerationSeconds: number
}

function formatDurationSeconds(totalSeconds: number): string {
  if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`
  const m = Math.floor(totalSeconds / 60)
  const s = Math.round(totalSeconds % 60)
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export function KpiRow({
  pipelineCount,
  avgCostPerProject,
  modelUptimePercent,
  avgGenerationSeconds,
}: KpiRowProps) {
  const cards = [
    {
      label: "Total Pipelines",
      value: String(pipelineCount),
      sub: "Active + completed",
      icon: GitBranch,
    },
    {
      label: "Avg Cost / Project",
      value: formatCurrencyPrecise(avgCostPerProject),
      sub: "AI compute only",
      icon: DollarSign,
    },
    {
      label: "Model Uptime",
      value: `${modelUptimePercent.toFixed(1)}%`,
      sub: "30-day rolling",
      icon: Activity,
    },
    {
      label: "Avg Generation Time",
      value: formatDurationSeconds(avgGenerationSeconds),
      sub: "End-to-end pipeline",
      icon: Timer,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-slate-900">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{sub}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
