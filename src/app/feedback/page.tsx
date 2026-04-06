"use client"

import { useState, useEffect } from "react"
import { RequireRole } from "@/components/auth/require-role"
import { ActionableItemsPanel } from "@/components/feedback/actionable-items-panel"
import { FeedbackHeader } from "@/components/feedback/feedback-header"
import { HowItWorks } from "@/components/feedback/how-it-works"
import { LiveTranslationDemo } from "@/components/feedback/live-translation-demo"
import { TranslationHistory } from "@/components/feedback/translation-history"
import { EmptyState } from "@/components/ui/empty-state"
import { getFeedbackTranslations } from "@/lib/api"
import type { FeedbackTranslation } from "@/types"

export default function FeedbackPage() {
  const [translations, setTranslations] = useState<FeedbackTranslation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getFeedbackTranslations()
      .then((data) => {
        if (!cancelled) setTranslations(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <RequireRole permission="feedback:view">
      <div className="flex flex-col gap-6 p-8">
        <FeedbackHeader />
        <LiveTranslationDemo />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : translations.length === 0 ? (
          <EmptyState
            title="No translations yet"
            description="Client feedback translations will appear here."
          />
        ) : (
          <>
            <TranslationHistory translations={translations} />
            <ActionableItemsPanel translations={translations} />
          </>
        )}
        <HowItWorks />
      </div>
    </RequireRole>
  )
}
