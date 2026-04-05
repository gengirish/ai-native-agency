"use client"

import type { ChannelConfig } from "@/types"
import { cn, formatRelativeTime } from "@/lib/utils"
import { CHANNEL_ICONS, channelIconWrapClass } from "./channel-styles"

type Props = {
  configs: ChannelConfig[]
}

export function ConnectedChannelsRow({ configs }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-800">Connected channels</h2>
      <div className="flex flex-wrap gap-4">
        {configs.map((c) => {
          const Icon = CHANNEL_ICONS[c.channel]
          return (
            <div
              key={c.channel}
              className={cn(
                "flex min-w-[200px] flex-1 flex-col gap-3 rounded-xl bg-white p-4 shadow-sm",
                c.connected
                  ? "ring-2 ring-green-500 ring-offset-2"
                  : "border-2 border-dashed border-slate-300"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                    channelIconWrapClass(c.channel)
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{c.label}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        c.connected ? "bg-green-500" : "bg-slate-300"
                      )}
                    />
                    <span
                      className={cn(
                        c.connected ? "text-green-700" : "text-slate-500"
                      )}
                    >
                      {c.connected ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                </div>
              </div>
              {c.connected && c.accountName && (
                <p className="truncate text-xs text-slate-600">{c.accountName}</p>
              )}
              {c.connected && c.lastSync && (
                <p className="text-xs text-slate-500">
                  Last sync {formatRelativeTime(c.lastSync)}
                </p>
              )}
              {!c.connected && (
                <button
                  type="button"
                  className="mt-auto w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Connect
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
