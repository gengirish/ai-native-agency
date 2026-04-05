import type { Metadata } from "next"
import { ActionableItemsPanel } from "@/components/feedback/actionable-items-panel"
import { FeedbackHeader } from "@/components/feedback/feedback-header"
import { HowItWorks } from "@/components/feedback/how-it-works"
import { LiveTranslationDemo } from "@/components/feedback/live-translation-demo"
import { TranslationHistory } from "@/components/feedback/translation-history"
import { mockFeedbackTranslations } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Feedback Copilot — AgencyOS",
  description: "Translate vague client feedback into actionable design parameters.",
}

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <FeedbackHeader />
      <LiveTranslationDemo />
      <TranslationHistory translations={mockFeedbackTranslations} />
      <ActionableItemsPanel translations={mockFeedbackTranslations} />
      <HowItWorks />
    </div>
  )
}
