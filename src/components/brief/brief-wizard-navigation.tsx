"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BriefWizardNavigationProps {
  onBack: () => void
  onNext: () => void
  backLabel?: string
  nextLabel?: string
  showBack?: boolean
  nextDisabled?: boolean
  isLastStep?: boolean
  isSubmitting?: boolean
}

export function BriefWizardNavigation({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  showBack = true,
  nextDisabled = false,
  isLastStep = false,
  isSubmitting = false,
}: BriefWizardNavigationProps) {
  return (
    <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isSubmitting}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          nextDisabled || isSubmitting
            ? "cursor-not-allowed bg-indigo-300"
            : "bg-indigo-600 hover:bg-indigo-700"
        )}
      >
        {isLastStep ? (isSubmitting ? "Creating…" : "Submit brief") : nextLabel}
        {!isLastStep && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  )
}
