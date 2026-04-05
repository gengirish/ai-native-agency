"use client"

import type { ExpertAssignment } from "@/types"
import { CheckCircle2, Clock, ListTodo, Timer } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

function countCompletedToday(assignments: ExpertAssignment[]): number {
  const now = new Date()
  return assignments.filter((a) => {
    if (a.status !== "completed" || !a.completedAt) return false
    const d = new Date(a.completedAt)
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }).length
}

function avgReviewMinutes(assignments: ExpertAssignment[]): number {
  const done = assignments.filter(
    (a) => a.status === "completed" && a.reviewTimeMinutes > 0
  )
  if (done.length === 0) return 0
  const sum = done.reduce((acc, a) => acc + a.reviewTimeMinutes, 0)
  return Math.round((sum / done.length) * 10) / 10
}

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string | number
  className?: string
}

function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}

type ExpertStatsRowProps = {
  assignments: ExpertAssignment[]
}

export function ExpertStatsRow({ assignments }: ExpertStatsRowProps) {
  const inQueue = assignments.filter((a) => a.status === "queued").length
  const inReview = assignments.filter(
    (a) => a.status === "in_review" || a.status === "claimed"
  ).length
  const completedToday = countCompletedToday(assignments)
  const avgReview = avgReviewMinutes(assignments)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<ListTodo className="h-5 w-5" />}
        label="In Queue"
        value={inQueue}
      />
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        label="In Review"
        value={inReview}
      />
      <StatCard
        icon={<CheckCircle2 className="h-5 w-5" />}
        label="Completed Today"
        value={completedToday}
      />
      <StatCard
        icon={<Timer className="h-5 w-5" />}
        label="Avg Review Time"
        value={avgReview > 0 ? `${avgReview} min` : "—"}
      />
    </div>
  )
}
