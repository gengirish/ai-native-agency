"use client"

import { useMemo, useState } from "react"
import type { ChannelConfig, PublishingChannel } from "@/types"
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
}

export function QuickPublishPanel({
  channelConfigs,
  deliverableOptions,
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

  const toggleChannel = (ch: PublishingChannel) => {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }))
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
                defaultValue="2026-04-10"
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
                defaultValue="14:00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Publish Now
          </button>
          <button
            type="button"
            className="rounded-lg border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Schedule for Later
          </button>
        </div>
      </div>
    </section>
  )
}
