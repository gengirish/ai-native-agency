"use client"

import type { BrandProfile } from "@/types"
import { formatDate } from "@/lib/utils"
import { ExternalLink, FolderKanban, Users } from "lucide-react"
import { DnaScoreRing } from "./dna-score-ring"

type BrandProfileCardProps = {
  brand: BrandProfile
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function BrandProfileCard({ brand }: BrandProfileCardProps) {
  const primary = brand.colors.find((c) => c.usage === "primary")?.hex ?? "#6366f1"

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white shadow-inner"
            style={{ background: `linear-gradient(135deg, ${primary}, ${brand.colors[1]?.hex ?? "#334155"})` }}
            aria-hidden
          >
            {initials(brand.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{brand.name}</h2>
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
              >
                {brand.websiteUrl.replace(/^https?:\/\//, "")}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              </a>
            </div>
            <p className="text-sm text-slate-600">{brand.industry}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
          <DnaScoreRing
            score={brand.dnaScore}
            size={140}
            strokeWidth={10}
            progressClassName="stroke-violet-600"
          />
          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <FolderKanban className="h-4 w-4" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide">Projects</span>
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                {brand.projectsCompleted}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDate(brand.lastUpdated)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="h-4 w-4" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide">Competitors</span>
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                {brand.competitors.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
