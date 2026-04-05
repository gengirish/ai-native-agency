"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  value: number
  max?: number
  onChange?: (value: number) => void
  size?: "sm" | "md"
}

export function StarRating({ value, max = 5, onChange, size = "md" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"
  const interactive = Boolean(onChange)

  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= value
        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(starValue)}
            className={cn(
              "rounded p-0.5 transition-colors",
              interactive && "hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500",
              !interactive && "cursor-default",
            )}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            aria-pressed={filled}
          >
            <Star
              className={cn(
                iconSize,
                filled ? "fill-amber-400 text-amber-400" : "fill-none text-slate-300",
              )}
              strokeWidth={filled ? 0 : 1.5}
            />
          </button>
        )
      })}
    </div>
  )
}
