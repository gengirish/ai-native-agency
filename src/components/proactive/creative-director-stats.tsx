import type { ProactiveSuggestion, SuggestionStatus } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Lightbulb, Percent, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export type ProactiveFilterKey = "all" | "actionable" | SuggestionStatus

interface CreativeDirectorStatsProps {
  suggestions: ProactiveSuggestion[]
  filter: ProactiveFilterKey
  onFilterChange: (f: ProactiveFilterKey) => void
}

const FILTERS: { key: ProactiveFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "actionable", label: "Needs action" },
  { key: "pending", label: "Pending" },
  { key: "generated", label: "Generated" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Dismissed" },
]

export function CreativeDirectorStats({
  suggestions,
  filter,
  onFilterChange,
}: CreativeDirectorStatsProps) {
  const pendingCount = suggestions.filter((s) => s.status === "pending").length
  const revenuePool = suggestions.filter(
    (s) => s.status === "pending" || s.status === "generated"
  )
  const estimatedRevenue = revenuePool.reduce((sum, s) => sum + s.estimatedValue, 0)
  const accepted = suggestions.filter((s) => s.status === "accepted").length
  const rejected = suggestions.filter((s) => s.status === "rejected").length
  const decided = accepted + rejected
  const acceptanceRate =
    decided === 0 ? null : Math.round((accepted / decided) * 1000) / 10

  const cards = [
    {
      label: "Pending suggestions",
      value: String(pendingCount),
      sub: "Awaiting your decision",
      icon: Lightbulb,
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Estimated revenue",
      value: formatCurrency(estimatedRevenue),
      sub: "Pending + generated pipeline",
      icon: TrendingUp,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Acceptance rate",
      value: acceptanceRate === null ? "N/A" : `${acceptanceRate}%`,
      sub:
        decided === 0
          ? "No accepts or dismissals yet"
          : `${accepted} accepted · ${rejected} dismissed`,
      icon: Percent,
      iconClass: "bg-violet-100 text-violet-700",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                c.iconClass
              )}
            >
              <c.icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                {c.value}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilterChange(f.key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
