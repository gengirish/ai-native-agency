import type { ActionableItem } from "@/types"
import { cn, formatPercent } from "@/lib/utils"

export function confidenceToneClass(confidence: number): string {
  if (confidence >= 0.85) return "bg-emerald-100 text-emerald-800 ring-emerald-200"
  if (confidence >= 0.7) return "bg-amber-100 text-amber-800 ring-amber-200"
  return "bg-rose-100 text-rose-800 ring-rose-200"
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        confidenceToneClass(confidence)
      )}
    >
      {formatPercent(confidence)} confidence
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: ActionableItem["priority"] }) {
  const map = {
    high: "bg-red-100 text-red-800 ring-red-200",
    medium: "bg-amber-100 text-amber-800 ring-amber-200",
    low: "bg-slate-100 text-slate-700 ring-slate-200",
  } as const
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        map[priority]
      )}
    >
      {priority}
    </span>
  )
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium capitalize text-indigo-800 ring-1 ring-indigo-100">
      {category}
    </span>
  )
}
