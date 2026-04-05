"use client"

import { cn } from "@/lib/utils"

const STEP_LABELS = [
  "Type",
  "Details",
  "Brand",
  "Deliverables",
  "Review",
]

interface BriefStepIndicatorProps {
  currentStep: number
  totalSteps?: number
}

export function BriefStepIndicator({ currentStep, totalSteps = 5 }: BriefStepIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentStep
          const isComplete = stepNum < currentStep
          return (
            <div key={stepNum} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isComplete && "bg-indigo-600 text-white",
                    isActive && !isComplete && "bg-indigo-600 text-white ring-4 ring-indigo-100",
                    !isActive && !isComplete && "border-2 border-slate-200 bg-white text-slate-500"
                  )}
                >
                  {isComplete ? "✓" : stepNum}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    isActive || isComplete ? "text-indigo-700" : "text-slate-400"
                  )}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
              {stepNum < totalSteps && (
                <div
                  className={cn(
                    "mx-2 h-0.5 min-w-[1rem] flex-1 rounded-full",
                    stepNum < currentStep ? "bg-indigo-600" : "bg-slate-200"
                  )}
                  aria-hidden
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
