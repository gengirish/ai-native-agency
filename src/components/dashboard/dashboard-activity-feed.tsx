"use client"

import { useMemo } from "react"
import { MessageSquare, UserCheck } from "lucide-react"
import type { ExpertAssignment, Review } from "@/types"
import { cn, formatRelativeTime } from "@/lib/utils"
import { formatStatusLabel } from "./format-project"

type FeedItem = {
  id: string
  at: string
  kind: "assignment" | "review"
  title: string
  detail: string
}

function buildFeedItems(
  assignments: ExpertAssignment[],
  reviews: Review[]
): FeedItem[] {
  const items: FeedItem[] = []

  for (const a of assignments) {
    if (a.completedAt && a.status === "completed") {
      const delta =
        a.qualityAfter > 0 && a.qualityBefore > 0
          ? `Quality ${a.qualityBefore.toFixed(1)} → ${a.qualityAfter.toFixed(1)}`
          : `${a.reviewTimeMinutes} min review`
      items.push({
        id: `ea-done-${a.id}`,
        at: a.completedAt,
        kind: "assignment",
        title: "Expert review completed",
        detail: `${a.expertName} · ${a.projectTitle} · ${delta}`,
      })
    } else if (a.claimedAt) {
      const verb =
        a.status === "in_review"
          ? "Review in progress"
          : a.status === "queued"
            ? "Queued for expert"
            : a.status === "claimed"
              ? "Expert claimed task"
              : "Expert assignment updated"
      items.push({
        id: `ea-claim-${a.id}`,
        at: a.claimedAt,
        kind: "assignment",
        title: verb,
        detail: `${a.expertName} · ${a.projectTitle}`,
      })
    }
  }

  for (const r of reviews) {
    const statusLabel = formatStatusLabel(r.status)
    items.push({
      id: `rev-${r.id}`,
      at: r.createdAt,
      kind: "review",
      title: `${r.reviewerName} — ${statusLabel}`,
      detail:
        r.rating > 0
          ? `${r.rating}/5 · Project review`
          : "Awaiting rating · Project review",
    })
  }

  return items.sort((x, y) => new Date(y.at).getTime() - new Date(x.at).getTime())
}

export function DashboardActivityFeed({
  assignments,
  reviews,
}: {
  assignments: ExpertAssignment[]
  reviews: Review[]
}) {
  const items = useMemo(() => buildFeedItems(assignments, reviews), [assignments, reviews])

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
      <p className="mt-1 text-sm text-slate-500">Expert work and reviews</p>
      <ul className="relative mt-6 space-y-0 pl-2">
        <span
          className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200"
          aria-hidden
        />
        {items.slice(0, 12).map((item) => (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white",
                item.kind === "assignment"
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-violet-100 text-violet-600"
              )}
            >
              {item.kind === "assignment" ? (
                <UserCheck className="size-4" aria-hidden />
              ) : (
                <MessageSquare className="size-4" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
              <time
                className="mt-1 block text-xs text-slate-400"
                dateTime={item.at}
              >
                {formatRelativeTime(item.at)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
