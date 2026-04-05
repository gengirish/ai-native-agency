"use client"

import type { BrandFont } from "@/types"
import { cn } from "@/lib/utils"

type TypographySectionProps = {
  fonts: BrandFont[]
}

function usageLabel(usage: BrandFont["usage"]) {
  return usage.charAt(0).toUpperCase() + usage.slice(1)
}

const sampleByUsage: Record<BrandFont["usage"], string> = {
  heading: "The quick brown fox jumps over the lazy dog.",
  body: "AgencyOS helps teams ship brand-perfect work with AI and expert review in one flow.",
  accent: "0123456789 · NEW · BETA",
}

export function TypographySection({ fonts }: TypographySectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Typography</h3>
      <p className="mt-1 text-sm text-slate-500">Approved typefaces, weights, and sample rendering.</p>
      <div className="mt-6 space-y-6">
        {fonts.map((font) => (
          <div
            key={`${font.name}-${font.usage}`}
            className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold text-slate-900">{font.name}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {usageLabel(font.usage)}
                </span>
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  Weight {font.weight}
                </span>
              </div>
            </div>
            <p
              className={cn(
                "mt-4 text-slate-800 leading-relaxed",
                font.usage === "heading" && "text-2xl sm:text-3xl",
                font.usage === "body" && "text-base",
                font.usage === "accent" && "text-lg tracking-wide"
              )}
              style={{
                fontFamily: `"${font.name}", ui-sans-serif, system-ui, sans-serif`,
                fontWeight: Number(font.weight) || 400,
              }}
            >
              {sampleByUsage[font.usage]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
