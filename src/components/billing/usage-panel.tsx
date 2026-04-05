import type { UsageRecord } from "@/types"
import { cn, formatCurrency, formatCurrencyPrecise, formatPercent } from "@/lib/utils"

const TENANT_LABELS: Record<string, string> = {
  t2: "Lumina Brands",
  t3: "TechFlow",
}

function marginColor(margin: number) {
  if (margin > 0.8) return "text-emerald-600"
  if (margin > 0.6) return "text-amber-600"
  return "text-red-600"
}

function marginBarColor(margin: number) {
  if (margin > 0.8) return "bg-emerald-500"
  if (margin > 0.6) return "bg-amber-500"
  return "bg-red-500"
}

export function UsagePanel({ records }: { records: UsageRecord[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      {records.map((r) => {
        const label = TENANT_LABELS[r.tenantId] ?? r.tenantId
        const totalCredits = r.creditsUsed + r.creditsRemaining
        const usedPct = totalCredits > 0 ? (r.creditsUsed / totalCredits) * 100 : 0
        return (
          <div
            key={`${r.tenantId}-${r.month}`}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
                <p className="text-sm text-slate-500">{r.month}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {r.projectsCompleted} projects completed
              </span>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Credits</span>
                <span className="font-medium text-slate-900">
                  {r.creditsUsed} used · {r.creditsRemaining} left
                </span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-[width]"
                  style={{ width: `${Math.min(100, usedPct)}%` }}
                />
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Total spend</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {formatCurrency(r.totalSpend)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">AI cost</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {formatCurrencyPrecise(r.aiCost)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Margin</dt>
                <dd className={cn("mt-0.5 text-lg font-bold", marginColor(r.margin))}>
                  {formatPercent(r.margin)}
                </dd>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", marginBarColor(r.margin))}
                    style={{ width: `${Math.min(100, r.margin * 100)}%` }}
                  />
                </div>
              </div>
            </dl>
          </div>
        )
      })}
    </div>
  )
}
