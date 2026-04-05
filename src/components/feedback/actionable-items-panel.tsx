"use client"

import { useMemo, useState } from "react"
import type { ActionableItem, FeedbackTranslation } from "@/types"
import { cn } from "@/lib/utils"
import { PriorityBadge } from "./feedback-badges"

type EnrichedItem = ActionableItem & { key: string }

const ORDER: ActionableItem["priority"][] = ["high", "medium", "low"]

function collectItems(translations: FeedbackTranslation[]): EnrichedItem[] {
  const out: EnrichedItem[] = []
  for (const t of translations) {
    t.actionableItems.forEach((item, i) => {
      out.push({
        ...item,
        key: `${t.id}:${i}:${item.parameter}`,
      })
    })
  }
  return out
}

export function ActionableItemsPanel({ translations }: { translations: FeedbackTranslation[] }) {
  const [applied, setApplied] = useState<Set<string>>(() => new Set())

  const grouped = useMemo(() => {
    const items = collectItems(translations)
    const map: Record<ActionableItem["priority"], EnrichedItem[]> = {
      high: [],
      medium: [],
      low: [],
    }
    for (const item of items) {
      map[item.priority].push(item)
    }
    return map
  }, [translations])

  function toggle(key: string) {
    setApplied((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Actionable items</h2>
      <p className="mt-1 text-sm text-slate-600">
        Everything extracted from history, grouped by priority. Check off items as you apply them in the design.
      </p>

      <div className="mt-6 space-y-8">
        {ORDER.map((priority) => {
          const list = grouped[priority]
          if (list.length === 0) return null
          return (
            <div key={priority}>
              <div className="mb-3 flex items-center gap-2">
                <PriorityBadge priority={priority} />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {list.length} item{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="space-y-2">
                {list.map((item) => {
                  const isApplied = applied.has(item.key)
                  return (
                    <li
                      key={item.key}
                      className={cn(
                        "rounded-lg border border-slate-100 bg-slate-50/50 transition",
                        isApplied && "border-slate-200 bg-slate-100/80 opacity-70"
                      )}
                    >
                      <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isApplied}
                          onChange={() => toggle(item.key)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="min-w-0 flex-1 text-sm">
                          <p className={cn("font-medium text-slate-900", isApplied && "line-through")}>
                            <span className="capitalize">{item.action}</span>{" "}
                            <span className="font-normal text-slate-600">{item.parameter}</span>
                          </p>
                          <p className="mt-0.5 text-slate-700">
                            <span className="text-slate-500">Suggested: </span>
                            {item.value}
                          </p>
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
