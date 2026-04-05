import type { PublishingStatus } from "@/types"
import { cn } from "@/lib/utils"

export function publishingStatusBadgeClass(status: PublishingStatus): string {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
  const by: Record<PublishingStatus, string> = {
    draft: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-800",
    publishing: "bg-purple-100 text-purple-800 animate-pulse",
    live: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  }
  return cn(base, by[status])
}
