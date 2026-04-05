"use client"

import type { PublishingJob } from "@/types"
import { formatPercent } from "@/lib/utils"

type Props = {
  jobs: PublishingJob[]
}

const nf = new Intl.NumberFormat("en-US")

export function PublishingMetricsSummary({ jobs }: Props) {
  const withMetrics = jobs.filter((j) => j.metrics)
  const liveCount = jobs.filter((j) => j.status === "live").length
  const totalImpressions = withMetrics.reduce(
    (sum, j) => sum + (j.metrics?.impressions ?? 0),
    0
  )
  const avgEngagement =
    withMetrics.length > 0
      ? withMetrics.reduce((sum, j) => sum + (j.metrics?.engagement ?? 0), 0) /
        withMetrics.length
      : 0

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total published
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{liveCount}</p>
        <p className="mt-1 text-xs text-slate-500">Live jobs</p>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total impressions
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {withMetrics.length ? nf.format(totalImpressions) : "—"}
        </p>
        <p className="mt-1 text-xs text-slate-500">From tracked posts</p>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Avg engagement rate
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {withMetrics.length ? formatPercent(avgEngagement) : "—"}
        </p>
        <p className="mt-1 text-xs text-slate-500">Jobs with metrics only</p>
      </div>
    </section>
  )
}
