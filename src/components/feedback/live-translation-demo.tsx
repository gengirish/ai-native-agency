"use client"

import { useCallback, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import type { ActionableItem, FeedbackTranslation } from "@/types"
import { cn } from "@/lib/utils"
import { translateClientFeedback } from "@/lib/api"
import { CategoryTag, ConfidenceBadge, PriorityBadge } from "./feedback-badges"

const DEFAULT_INPUT = "Make it feel more premium"

export function LiveTranslationDemo() {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FeedbackTranslation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const translate = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const out = await translateClientFeedback(trimmed)
      if (!out.ok) {
        setError(out.error)
        return
      }
      setResult(out.data)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Live translation demo</h2>
      <p className="mt-1 text-sm text-slate-600">
        Type vague client feedback and see how the copilot turns it into concrete design parameters.
      </p>

      <div className="mt-6 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Client feedback…"
        />

        <button
          type="button"
          onClick={() => void translate()}
          disabled={loading || !input.trim()}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden />
          )}
          {loading ? "Translating…" : "Translate"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {result && (
        <div className="mt-8 space-y-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <ConfidenceBadge confidence={result.confidence} />
            <CategoryTag category={result.category} />
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-900">{result.translated}</p>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actionable items
            </p>
            <ul className="space-y-2">
              {result.actionableItems.map((item: ActionableItem, i: number) => (
                <li
                  key={`${item.parameter}-${i}`}
                  className="flex flex-wrap items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm ring-1 ring-emerald-100"
                >
                  <span className="font-medium capitalize text-slate-800">{item.action}</span>
                  <span className="text-slate-500">{item.parameter}</span>
                  <span className="text-slate-700">→ {item.value}</span>
                  <PriorityBadge priority={item.priority} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
