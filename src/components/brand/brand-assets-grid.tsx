"use client"

import type { BrandAsset } from "@/types"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

type BrandAssetsGridProps = {
  assets: BrandAsset[]
}

const typeHue: Record<BrandAsset["type"], string> = {
  logo: "from-violet-500 to-purple-600",
  icon: "from-sky-500 to-blue-600",
  pattern: "from-amber-400 to-orange-500",
  photo: "from-emerald-500 to-teal-600",
  template: "from-slate-500 to-slate-700",
}

function typeLabel(type: BrandAsset["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function BrandAssetsGrid({ assets }: BrandAssetsGridProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Brand assets</h3>
          <p className="mt-1 text-sm text-slate-500">Logos, patterns, and approved files.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload asset
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <article
            key={asset.id}
            className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
          >
            <div
              className={cn(
                "relative h-36 w-full bg-gradient-to-br",
                typeHue[asset.type]
              )}
              aria-hidden
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-slate-900">{asset.name}</h4>
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                  {typeLabel(asset.type)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
