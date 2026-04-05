"use client"

import { useState } from "react"
import type { BrandColor } from "@/types"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type ColorPaletteSectionProps = {
  colors: BrandColor[]
}

const usageStyles: Record<BrandColor["usage"], string> = {
  primary: "bg-violet-100 text-violet-800",
  secondary: "bg-slate-200 text-slate-800",
  accent: "bg-amber-100 text-amber-900",
  neutral: "bg-slate-100 text-slate-700",
}

function usageLabel(usage: BrandColor["usage"]) {
  return usage.charAt(0).toUpperCase() + usage.slice(1)
}

export function ColorPaletteSection({ colors }: ColorPaletteSectionProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const handleSwatchClick = (hex: string) => {
    setCopiedHex(hex)
    window.setTimeout(() => setCopiedHex(null), 1600)
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Color palette</h3>
      <p className="mt-1 text-sm text-slate-500">Brand colors with usage roles. Tap a swatch to copy (preview).</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {colors.map((color) => {
          const isCopied = copiedHex === color.hex
          const isLight =
            color.hex.replace("#", "").length === 6 &&
            parseInt(color.hex.slice(1, 3), 16) * 0.299 +
              parseInt(color.hex.slice(3, 5), 16) * 0.587 +
              parseInt(color.hex.slice(5, 7), 16) * 0.114 >
              186

          return (
            <button
              key={`${color.name}-${color.hex}`}
              type="button"
              onClick={() => handleSwatchClick(color.hex)}
              className="group text-left transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <div className="relative overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
                <div
                  className="h-20 w-full rounded-xl transition-[box-shadow] group-hover:shadow-md"
                  style={{ backgroundColor: color.hex }}
                />
                {isCopied && (
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-xl text-xs font-semibold backdrop-blur-[2px]",
                      isLight ? "bg-white/70 text-slate-900" : "bg-black/40 text-white"
                    )}
                  >
                    <Check className="mr-1 h-4 w-4" aria-hidden />
                    Copied
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <p className="font-medium text-slate-900">{color.name}</p>
                <p className="font-mono text-sm text-slate-600">{color.hex}</p>
                <span
                  className={cn(
                    "inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                    usageStyles[color.usage]
                  )}
                >
                  {usageLabel(color.usage)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
