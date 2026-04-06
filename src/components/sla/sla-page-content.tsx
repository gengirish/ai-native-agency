"use client"

import { useState, useEffect } from "react"
import { getSLACompliance, getSLATiers } from "@/lib/api"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { SLAComplianceOverview } from "@/components/sla/sla-compliance-overview"
import { SLATiersComparison } from "@/components/sla/sla-tiers-comparison"
import { SLAActiveTracking } from "@/components/sla/sla-active-tracking"
import { SLAGuaranteeCard } from "@/components/sla/sla-guarantee-card"
import { SLABreachTimeline } from "@/components/sla/sla-breach-timeline"
import { Shield } from "lucide-react"
import type { SLACompliance, SLATier } from "@/types"

export function SLAPageContent() {
  const [compliance, setCompliance] = useState<SLACompliance[]>([])
  const [tiers, setTiers] = useState<SLATier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [c, t] = await Promise.all([getSLACompliance(), getSLATiers()])
        if (!cancelled) {
          setCompliance(c)
          setTiers(t)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const noData = !loading && compliance.length === 0 && tiers.length === 0

  return (
    <RequireRole permission="sla:view">
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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : noData ? (
          <EmptyState
            title="No SLA data"
            description="SLA tracking will begin when projects are assigned to tiers."
          />
        ) : (
          <>
            <SLAComplianceOverview records={compliance} />
            <SLATiersComparison tiers={tiers} />
            <SLAActiveTracking records={compliance} />
          </>
        )}

        <SLAGuaranteeCard />
        <SLABreachTimeline />
      </div>
    </RequireRole>
  )
}
