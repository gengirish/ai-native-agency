"use client"

import { mockSLACompliance, mockSLATiers } from "@/lib/mock-data"
import { SLAComplianceOverview } from "@/components/sla/sla-compliance-overview"
import { SLATiersComparison } from "@/components/sla/sla-tiers-comparison"
import { SLAActiveTracking } from "@/components/sla/sla-active-tracking"
import { SLAGuaranteeCard } from "@/components/sla/sla-guarantee-card"
import { SLABreachTimeline } from "@/components/sla/sla-breach-timeline"
import { Shield } from "lucide-react"

export function SLAPageContent() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">SLA Management</h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            Guaranteed turnaround times with financial penalties — the advantage of AI-first delivery
          </p>
        </div>
      </header>

      <SLAComplianceOverview records={mockSLACompliance} />
      <SLATiersComparison tiers={mockSLATiers} />
      <SLAActiveTracking records={mockSLACompliance} />
      <SLAGuaranteeCard />
      <SLABreachTimeline />
    </div>
  )
}
