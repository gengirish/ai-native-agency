"use client"

import type { BrandProfile } from "@/types"
import { cn } from "@/lib/utils"
import { DnaScoreRing } from "./dna-score-ring"

type BrandSelectorProps = {
  profiles: BrandProfile[]
  selectedId: string
  onSelect: (id: string) => void
}

export function BrandSelector({ profiles, selectedId, onSelect }: BrandSelectorProps) {
  const selected = profiles.find((p) => p.id === selectedId) ?? profiles[0]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
        role="tablist"
        aria-label="Client brands"
      >
        {profiles.map((profile) => {
          const isActive = profile.id === selectedId
          return (
            <button
              key={profile.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(profile.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {profile.name}
            </button>
          )
        })}
      </div>
      {selected && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <DnaScoreRing
            score={selected.dnaScore}
            size={56}
            strokeWidth={5}
            progressClassName="stroke-emerald-500"
            showLabel
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Selected brand
            </p>
            <p className="text-sm font-semibold text-slate-900">{selected.name}</p>
            <p className="text-xs text-slate-500">DNA completeness score</p>
          </div>
        </div>
      )}
    </div>
  )
}
