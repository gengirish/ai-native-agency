"use client"

import { useMemo, useState } from "react"
import type { PublishingJob } from "@/types"
import { cn } from "@/lib/utils"
import { PublishingJobCard } from "./publishing-job-card"

type Tab = "all" | "draft" | "scheduled" | "live" | "failed"

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "live", label: "Live" },
  { id: "failed", label: "Failed" },
]

type Props = {
  jobs: PublishingJob[]
}

function matchesTab(job: PublishingJob, tab: Tab): boolean {
  if (tab === "all") return true
  return job.status === tab
}

export function PublishingQueue({ jobs }: Props) {
  const [tab, setTab] = useState<Tab>("all")

  const filtered = useMemo(
    () => jobs.filter((j) => matchesTab(j, tab)),
    [jobs, tab]
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Publishing queue</h2>
        <div
          role="tablist"
          className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                tab === t.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            No jobs in this view.
          </p>
        ) : (
          filtered.map((job) => <PublishingJobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  )
}
