"use client"

import { useState, useEffect } from "react"
import { getInvoices, getCreditPacks, getUsageRecords } from "@/lib/api"
import { cn } from "@/lib/utils"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import { CreditPacksPanel } from "@/components/billing/credit-packs-panel"
import { InvoicesPanel } from "@/components/billing/invoices-panel"
import { PricingPlansPanel } from "@/components/billing/pricing-plans-panel"
import { UsagePanel } from "@/components/billing/usage-panel"
import type { CreditPack, Invoice, UsageRecord } from "@/types"

type TabId = "pricing" | "credits" | "invoices" | "usage"

const tabs: { id: TabId; label: string }[] = [
  { id: "pricing", label: "Pricing Plans" },
  { id: "credits", label: "Credit Packs" },
  { id: "invoices", label: "Invoices" },
  { id: "usage", label: "Usage" },
]

export function BillingPageContent() {
  const [tab, setTab] = useState<TabId>("pricing")
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [packs, inv, usage] = await Promise.all([
          getCreditPacks(),
          getInvoices(),
          getUsageRecords(),
        ])
        if (!cancelled) {
          setCreditPacks(packs)
          setInvoices(inv)
          setUsageRecords(usage)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <RequireRole permission="billing:view">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Billing</h1>
          <p className="mt-1 text-slate-600">Pricing, invoices, credits, and usage tracking</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
                tab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-600 hover:text-slate-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <>
            {tab === "pricing" && <PricingPlansPanel />}
            {tab === "credits" &&
              (creditPacks.length === 0 ? (
                <EmptyState
                  title="No credit packs"
                  description="Credit pack options will appear here once configured."
                />
              ) : (
                <CreditPacksPanel packs={creditPacks} />
              ))}
            {tab === "invoices" &&
              (invoices.length === 0 ? (
                <EmptyState
                  title="No invoices"
                  description="Your billing history and invoices will show up here."
                />
              ) : (
                <InvoicesPanel invoices={invoices} />
              ))}
            {tab === "usage" &&
              (usageRecords.length === 0 ? (
                <EmptyState
                  title="No usage data"
                  description="Usage and credit consumption by period will appear here."
                />
              ) : (
                <UsagePanel records={usageRecords} />
              ))}
          </>
        )}
      </div>
    </RequireRole>
  )
}
