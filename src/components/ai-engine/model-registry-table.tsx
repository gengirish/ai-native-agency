import type { AIModel } from "@/types"
import { formatCurrencyPrecise } from "@/lib/utils"
import { Star } from "lucide-react"
import { providerBadgeClass, providerLabel } from "./provider-styles"

function formatLatencyMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

function QualityBar({ score }: { score: number }) {
  const pct = (score / 5) * 100
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-0.5 font-mono text-xs text-slate-600">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        {score.toFixed(1)}
      </div>
    </div>
  )
}

export function ModelRegistryTable({ models }: { models: AIModel[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Model Registry</h2>
        <p className="text-sm text-slate-500">Providers, pricing, latency, and quality signals</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Capabilities</th>
                <th className="px-4 py-3">Cost / 1k</th>
                <th className="px-4 py-3">Avg Latency</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map((m) => (
                <tr key={m.id} className="bg-white hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <span className={providerBadgeClass(m.provider)}>{providerLabel(m.provider)}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.capabilities.map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {c.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {formatCurrencyPrecise(m.costPer1kTokens)}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">{formatLatencyMs(m.avgLatencyMs)}</td>
                  <td className="px-4 py-3">
                    <QualityBar score={m.qualityScore} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          m.isActive
                            ? "relative inline-block h-6 w-11 rounded-full bg-emerald-500"
                            : "relative inline-block h-6 w-11 rounded-full bg-slate-300"
                        }
                      >
                        <span
                          className={
                            m.isActive
                              ? "absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                              : "absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                          }
                        />
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
