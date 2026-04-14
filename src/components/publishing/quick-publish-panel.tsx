"use client"

import { useMemo, useState } from "react"
import type { ChannelConfig, PublishingChannel, PublishingJob } from "@/types"
import { cn } from "@/lib/utils"
import { Rocket } from "lucide-react"
import { CHANNEL_ICONS, CHANNEL_LABELS, channelIconWrapClass } from "./channel-styles"

type DeliverableOption = {
  deliverableId: string
  projectTitle: string
}

type Props = {
  channelConfigs: ChannelConfig[]
  deliverableOptions: DeliverableOption[]
  jobs: PublishingJob[]
  patchPublishingJob: (
    id: string,
    body: { status: string; scheduledAt?: string },
  ) => Promise<boolean>
}

function defaultScheduleFields() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: "14:00",
  }
}

export function QuickPublishPanel({
  channelConfigs,
  deliverableOptions,
  jobs,
  patchPublishingJob,
}: Props) {
  const connected = useMemo(
    () => channelConfigs.filter((c) => c.connected),
    [channelConfigs]
  )

  const [selectedDeliverable, setSelectedDeliverable] = useState(
    deliverableOptions[0]?.deliverableId ?? ""
  )
  const [channels, setChannels] = useState<Record<PublishingChannel, boolean>>(
    () =>
      Object.fromEntries(
        connected.map((c) => [c.channel, true])
      ) as Record<PublishingChannel, boolean>
  )

  const defaults = useMemo(() => defaultScheduleFields(), [])
  const [scheduleDate, setScheduleDate] = useState(defaults.date)
  const [scheduleTime, setScheduleTime] = useState(defaults.time)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const toggleChannel = (ch: PublishingChannel) => {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }))
  }

  async function publishMatchingDrafts() {
    setLocalError(null)
    const targets = jobs.filter(
      (j) =>
        j.deliverableId === selectedDeliverable &&
        j.status === "draft" &&
        (channels[j.channel] ?? false),
    )
    if (!targets.length) {
      setLocalError("No draft jobs for this deliverable on the selected channels.")
      return
    }
    setSubmitting(true)
    try {
      for (const t of targets) {
        const ok = await patchPublishingJob(t.id, { status: "live" })
        if (!ok) return
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function scheduleMatchingDrafts() {
    setLocalError(null)
    const scheduledAtIso = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
    if (Number.isNaN(new Date(scheduledAtIso).getTime())) {
      setLocalError("Pick a valid date and time for scheduling.")
      return
    }
    const targets = jobs.filter(
      (j) =>
        j.deliverableId === selectedDeliverable &&
        j.status === "draft" &&
        (channels[j.channel] ?? false),
    )
    if (!targets.length) {
      setLocalError("No draft jobs for this deliverable on the selected channels.")
      return
    }
    setSubmitting(true)
    try {
      for (const t of targets) {
        const ok = await patchPublishingJob(t.id, {
          status: "scheduled",
          scheduledAt: scheduledAtIso,
        })
        if (!ok) return
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Rocket className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Publish to All Channels</h2>
            <p className="mt-1 max-w-xl text-sm text-indigo-100">
              Pick an approved deliverable, choose where it goes, then publish
              instantly or schedule.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 text-slate-900 shadow-sm">
        <label className="block text-xs font-medium text-slate-500">
          Deliverable
        </label>
        <select
          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          value={selectedDeliverable}
          onChange={(e) => setSelectedDeliverable(e.target.value)}
        >
          {deliverableOptions.map((d) => (
            <option key={d.deliverableId} value={d.deliverableId}>
              {d.projectTitle}
            </option>
          ))}
        </select>

        <p className="mt-5 text-xs font-medium text-slate-500">Channels</p>
        <ul className="mt-3 space-y-2">
          {connected.map((c) => {
            const Icon = CHANNEL_ICONS[c.channel]
            const checked = channels[c.channel] ?? false
            return (
              <li key={c.channel}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                    checked
                      ? "border-indigo-200 bg-indigo-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  )}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={checked}
                    onChange={() => toggleChannel(c.channel)}
                  />
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md",
                      channelIconWrapClass(c.channel)
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {CHANNEL_LABELS[c.channel]}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-xs font-medium text-slate-500">Schedule (optional)</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="pub-date">
                Date
              </label>
              <input
                id="pub-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="pub-time">
                Time
              </label>
              <input
                id="pub-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {localError ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {localError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={submitting || !selectedDeliverable}
            onClick={() => void publishMatchingDrafts()}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? "Working…" : "Publish Now"}
          </button>
          <button
            type="button"
            disabled={submitting || !selectedDeliverable}
            onClick={() => void scheduleMatchingDrafts()}
            className="rounded-lg border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
          >
            Schedule for Later
          </button>
        </div>
      </div>
    </section>
  )
}
