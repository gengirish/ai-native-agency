"use client"

import { cn } from "@/lib/utils"
import { confidenceRingColor } from "./autonomy-level-styles"

type ConfidenceRingProps = {
  confidence: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ConfidenceRing({
  confidence,
  size = 96,
  strokeWidth = 7,
  className,
}: ConfidenceRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, confidence * 100))
  const offset = circumference * (1 - pct / 100)
  const strokeClass = confidenceRingColor(confidence)

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            strokeClass,
            "transition-[stroke-dashoffset] duration-500 ease-out"
          )}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-semibold tabular-nums text-slate-900">
          {pct.toFixed(0)}%
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Conf.
        </span>
      </div>
    </div>
  )
}
