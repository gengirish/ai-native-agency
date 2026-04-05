import { ArrowRightLeft } from "lucide-react"
import type { FeedbackTranslation } from "@/types"
import { cn, formatPercent } from "@/lib/utils"
import { CategoryTag, confidenceToneClass, PriorityBadge } from "./feedback-badges"

export function TranslationHistory({ translations }: { translations: FeedbackTranslation[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Translation history</h2>
        <p className="mt-1 text-sm text-slate-600">Recent feedback the copilot has interpreted for your team.</p>
      </div>
      <div className="flex flex-col gap-6">
        {translations.map((t) => (
          <article
            key={t.id}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1 space-y-3">
                <blockquote className="text-sm italic text-slate-500">&ldquo;{t.original}&rdquo;</blockquote>
                <div className="flex items-center gap-2 text-slate-400">
                  <ArrowRightLeft className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="text-xs font-medium uppercase tracking-wide">Translated</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{t.translated}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                    confidenceToneClass(t.confidence)
                  )}
                >
                  {formatPercent(t.confidence)}
                </span>
                <CategoryTag category={t.category} />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2.5">Action</th>
                    <th className="px-4 py-2.5">Parameter</th>
                    <th className="px-4 py-2.5">Value</th>
                    <th className="px-4 py-2.5">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {t.actionableItems.map((item, i) => (
                    <tr key={`${t.id}-${i}`} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-2.5 font-medium capitalize text-slate-800">{item.action}</td>
                      <td className="px-4 py-2.5 text-slate-600">{item.parameter}</td>
                      <td className="px-4 py-2.5 text-slate-800">{item.value}</td>
                      <td className="px-4 py-2.5">
                        <PriorityBadge priority={item.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
