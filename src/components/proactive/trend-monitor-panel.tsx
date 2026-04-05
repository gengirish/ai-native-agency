import { formatRelativeTime } from "@/lib/utils"
import { Building2, CalendarDays, Radar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type FeedStatus = "active" | "scanning"

interface TrendFeed {
  id: string
  name: string
  description: string
  icon: typeof Users
  status: FeedStatus
  lastUpdateIso: string
}

const FEEDS: TrendFeed[] = [
  {
    id: "competitor",
    name: "Competitor activity",
    description: "Competitor watch — launches, campaigns, creative shifts",
    icon: Users,
    status: "active",
    lastUpdateIso: "2026-04-05T09:15:00Z",
  },
  {
    id: "seasonal",
    name: "Seasonal calendar",
    description: "Upcoming holidays and retail moments",
    icon: CalendarDays,
    status: "scanning",
    lastUpdateIso: "2026-04-05T07:40:00Z",
  },
  {
    id: "industry",
    name: "Industry trends",
    description: "Search volume, social spikes, category momentum",
    icon: Radar,
    status: "active",
    lastUpdateIso: "2026-04-05T10:02:00Z",
  },
  {
    id: "client-product",
    name: "Client product calendar",
    description: "Releases, roadmaps, and launch windows",
    icon: Building2,
    status: "scanning",
    lastUpdateIso: "2026-04-04T18:22:00Z",
  },
]

export function TrendMonitorPanel() {
  return (
    <aside className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">What we&apos;re watching</h2>
      <p className="mt-1 text-sm text-slate-600">
        Live feeds that power proactive suggestions
      </p>
      <ul className="mt-5 space-y-3">
        {FEEDS.map((feed) => (
          <li
            key={feed.id}
            className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-100">
              <feed.icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{feed.name}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    feed.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {feed.status === "active" ? "Active" : "Scanning"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600">{feed.description}</p>
              <p className="mt-1 text-[11px] text-slate-500">
                Updated {formatRelativeTime(feed.lastUpdateIso)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
