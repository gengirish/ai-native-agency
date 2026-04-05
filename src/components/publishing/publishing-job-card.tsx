"use client"

import type { PublishingJob } from "@/types"
import { cn, formatDate, formatPercent } from "@/lib/utils"
import { CHANNEL_LABELS, channelBadgeClass } from "./channel-styles"
import { publishingStatusBadgeClass } from "./publishing-status-styles"

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

const nf = new Intl.NumberFormat("en-US")

type Props = {
  job: PublishingJob
}

export function PublishingJobCard({ job }: Props) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h3 className="font-semibold text-slate-900">{job.projectTitle}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                channelBadgeClass(job.channel)
              )}
            >
              {CHANNEL_LABELS[job.channel]}
            </span>
            <span className={publishingStatusBadgeClass(job.status)}>
              {job.status}
            </span>
          </div>
        </div>
      </div>

      {job.status === "live" && job.metrics && (
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Impressions</dt>
            <dd className="font-medium text-slate-900">
              {nf.format(job.metrics.impressions)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Clicks</dt>
            <dd className="font-medium text-slate-900">
              {nf.format(job.metrics.clicks)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Engagement</dt>
            <dd className="font-medium text-slate-900">
              {formatPercent(job.metrics.engagement)}
            </dd>
          </div>
        </dl>
      )}

      {job.status === "scheduled" && job.scheduledAt && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
          Scheduled for{" "}
          <span className="font-medium text-slate-900">
            {formatDateTime(job.scheduledAt)}
          </span>
        </p>
      )}

      {job.status === "draft" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Publish Now
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Schedule
          </button>
        </div>
      )}

      {job.status === "live" && job.publishedAt && (
        <p className="mt-3 text-xs text-slate-500">
          Published {formatDate(job.publishedAt)}
        </p>
      )}
    </article>
  )
}
