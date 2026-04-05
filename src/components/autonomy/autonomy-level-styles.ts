import type { AutonomyLevel } from "@/types"
import { cn } from "@/lib/utils"

export const LEVEL_ORDER: AutonomyLevel[] = ["human_required", "spot_check", "autonomous"]

export function levelLabel(level: AutonomyLevel): string {
  switch (level) {
    case "autonomous":
      return "Autonomous"
    case "spot_check":
      return "Spot check"
    case "human_required":
      return "Human required"
  }
}

export function levelBadgeClass(level: AutonomyLevel): string {
  switch (level) {
    case "autonomous":
      return "bg-emerald-100 text-emerald-800 ring-emerald-600/20"
    case "spot_check":
      return "bg-amber-100 text-amber-900 ring-amber-600/20"
    case "human_required":
      return "bg-rose-100 text-rose-800 ring-rose-600/20"
  }
}

export function laneSurfaceClass(level: AutonomyLevel): string {
  switch (level) {
    case "autonomous":
      return "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30"
    case "spot_check":
      return "border-amber-200/70 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/20"
    case "human_required":
      return "border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/10"
  }
}

export function laneCardClass(level: AutonomyLevel): string {
  switch (level) {
    case "autonomous":
      return cn(
        "border-emerald-300/90 bg-white shadow-md ring-2 ring-emerald-500/15",
        "hover:shadow-lg hover:ring-emerald-500/25"
      )
    case "spot_check":
      return cn(
        "border-amber-200/90 bg-white shadow-sm ring-1 ring-amber-400/10",
        "hover:shadow-md"
      )
    case "human_required":
      return cn(
        "border-rose-200/80 bg-white/95 shadow-sm opacity-95",
        "hover:shadow-md hover:opacity-100"
      )
  }
}

export function confidenceRingColor(confidence: number): string {
  const pct = confidence * 100
  if (pct < 70) return "stroke-rose-500"
  if (pct <= 90) return "stroke-amber-500"
  return "stroke-emerald-500"
}

export function nextLevelProgress(
  level: AutonomyLevel,
  confidence: number
): { label: string; pct: number } {
  if (level === "autonomous") {
    return { label: "At full autonomy", pct: 100 }
  }
  if (level === "human_required") {
    const target = 0.85
    const pct = Math.min(100, Math.max(0, (confidence / target) * 100))
    return { label: "Progress toward spot check (85% confidence)", pct }
  }
  const low = 0.85
  const high = 0.95
  const pct = Math.min(100, Math.max(0, ((confidence - low) / (high - low)) * 100))
  return { label: "Progress toward autonomous (95% confidence)", pct }
}
