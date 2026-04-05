"use client"

import { cn } from "@/lib/utils"

type DnaScoreRingProps = {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  trackClassName?: string
  progressClassName?: string
}

export function DnaScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
  trackClassName = "stroke-slate-200",
  progressClassName = "stroke-violet-600",
}: DnaScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, score))
  const offset = circumference * (1 - pct / 100)

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(progressClassName, "transition-[stroke-dashoffset] duration-500 ease-out")}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <span
            className={cn(
              "font-semibold tabular-nums text-slate-900",
              size < 64 && "text-sm",
              size >= 64 && size < 112 && "text-xl",
              size >= 112 && "text-2xl"
            )}
          >
            {pct}
          </span>
          {size >= 64 && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              DNA
            </span>
          )}
        </div>
      )}
    </div>
  )
}
