"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { ProactiveSuggestion, SuggestionStatus } from "@/types"
import { getSuggestions } from "@/lib/api"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { CreativeDirectorHeader } from "./creative-director-header"
import {
  CreativeDirectorStats,
  type ProactiveFilterKey,
} from "./creative-director-stats"
import { SuggestionCard } from "./suggestion-card"
import { TrendMonitorPanel } from "./trend-monitor-panel"
import { CampaignCalendar } from "./campaign-calendar"

const SORT_ORDER: Record<SuggestionStatus, number> = {
  pending: 0,
  generated: 1,
  accepted: 2,
  rejected: 3,
}

function sortSuggestions(list: ProactiveSuggestion[]): ProactiveSuggestion[] {
  return [...list].sort((a, b) => {
    const o = SORT_ORDER[a.status] - SORT_ORDER[b.status]
    if (o !== 0) return o
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function filterSuggestions(
  list: ProactiveSuggestion[],
  filter: ProactiveFilterKey,
): ProactiveSuggestion[] {
  if (filter === "all") return list
  if (filter === "actionable")
    return list.filter((s) => s.status === "pending" || s.status === "generated")
  return list.filter((s) => s.status === filter)
}

export function ProactiveCreativeDirector() {
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ProactiveFilterKey>("all")
  const [generationProgress, setGenerationProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getSuggestions()
        if (!cancelled) setSuggestions(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const acceptedIds = suggestions
      .filter((s) => s.status === "accepted")
      .map((s) => s.id)

    if (acceptedIds.length === 0) return

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const next = { ...prev }
        let changed = false
        for (const id of acceptedIds) {
          const cur = next[id] ?? 0
          if (cur < 100) {
            next[id] = Math.min(100, cur + 2 + Math.random() * 2)
            changed = true
          }
        }
        return changed ? next : prev
      })
    }, 220)

    return () => clearInterval(interval)
  }, [suggestions])

  const accept = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "accepted" as const } : s)),
    )
    setGenerationProgress((p) => ({ ...p, [id]: 0 }))
  }, [])

  const dismiss = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "rejected" as const } : s)),
    )
  }, [])

  const filteredSorted = useMemo(
    () => sortSuggestions(filterSuggestions(suggestions, filter)),
    [suggestions, filter],
  )

  return (
    <RequireRole permission="proactive:view">
      <div className="flex flex-col gap-6 p-8">
        <CreativeDirectorHeader />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : suggestions.length === 0 ? (
          <EmptyState
            title="No suggestions"
            description="AI will generate proactive creative suggestions based on trends."
          />
        ) : (
          <>
            <CreativeDirectorStats
              suggestions={suggestions}
              filter={filter}
              onFilterChange={setFilter}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_min(100%,380px)] lg:items-start">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                  {filteredSorted.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-sm text-slate-600">
                      No suggestions match this filter.
                    </div>
                  ) : (
                    filteredSorted.map((s) => (
                      <SuggestionCard
                        key={s.id}
                        suggestion={s}
                        generationProgress={generationProgress[s.id] ?? 0}
                        onAccept={accept}
                        onDismiss={dismiss}
                      />
                    ))
                  )}
                </div>
                <CampaignCalendar suggestions={suggestions} />
              </div>
              <TrendMonitorPanel />
            </div>
          </>
        )}
      </div>
    </RequireRole>
  )
}
