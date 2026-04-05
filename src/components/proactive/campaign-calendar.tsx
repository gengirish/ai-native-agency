import type { ProactiveSuggestion } from "@/types"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CampaignCalendarProps {
  suggestions: ProactiveSuggestion[]
}

export function CampaignCalendar({ suggestions }: CampaignCalendarProps) {
  const dated = [...suggestions].sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
  )

  if (dated.length === 0) return null

  const min = new Date(dated[0].expiresAt).getTime()
  const max = new Date(dated[dated.length - 1].expiresAt).getTime()
  const span = Math.max(1, max - min)

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Campaign calendar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upcoming suggestion windows — confirmed vs tentative
      </p>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="relative min-h-[120px] min-w-[520px] px-1">
          <div className="absolute left-0 right-0 top-8 h-px bg-slate-200" />
          {dated.map((s) => {
            const t = new Date(s.expiresAt).getTime()
            const leftPct = ((t - min) / span) * 100
            const isRejected = s.status === "rejected"
            const isConfirmed = s.status === "accepted"
            const isTentative = s.status === "pending" || s.status === "generated"

            return (
              <div
                key={s.id}
                className="absolute top-0 w-[140px] -translate-x-1/2"
                style={{ left: `${leftPct}%` }}
              >
                <div
                  className={cn(
                    "mx-auto flex max-w-[140px] flex-col rounded-lg bg-white px-2 py-2 text-center shadow-sm",
                    isConfirmed &&
                      "border-2 border-solid border-green-500 bg-green-50/60",
                    isTentative &&
                      !isConfirmed &&
                      !isRejected &&
                      "border-2 border-dashed border-violet-400 bg-violet-50/40",
                    isRejected &&
                      "border border-dashed border-slate-300 bg-slate-50 opacity-70"
                  )}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {formatDate(s.expiresAt)}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-slate-900">
                    {s.title}
                  </span>
                  <span className="mt-0.5 truncate text-[10px] text-slate-500">
                    {s.clientName}
                  </span>
                </div>
                <div
                  className={cn(
                    "mx-auto mt-2 h-6 w-0.5 rounded-full",
                    isConfirmed ? "bg-green-500" : isTentative ? "bg-violet-400" : "bg-slate-300"
                  )}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-4 rounded border-2 border-solid border-green-500 bg-green-50" />
          Confirmed (accepted)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-4 rounded border-2 border-dashed border-violet-400 bg-violet-50/60" />
          Tentative (pending / generated)
        </span>
      </div>
    </section>
  )
}
