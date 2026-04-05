"use client"

import { useState } from "react"
import { mockCreditPacks, mockInvoices, mockUsageRecords } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CreditPacksPanel } from "@/components/billing/credit-packs-panel"
import { InvoicesPanel } from "@/components/billing/invoices-panel"
import { PricingPlansPanel } from "@/components/billing/pricing-plans-panel"
import { UsagePanel } from "@/components/billing/usage-panel"

type TabId = "pricing" | "credits" | "invoices" | "usage"

const tabs: { id: TabId; label: string }[] = [
  { id: "pricing", label: "Pricing Plans" },
  { id: "credits", label: "Credit Packs" },
  { id: "invoices", label: "Invoices" },
  { id: "usage", label: "Usage" },
]

export function BillingPageContent() {
  const [tab, setTab] = useState<TabId>("pricing")

  return (
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

      {tab === "pricing" && <PricingPlansPanel />}
      {tab === "credits" && <CreditPacksPanel packs={mockCreditPacks} />}
      {tab === "invoices" && <InvoicesPanel invoices={mockInvoices} />}
      {tab === "usage" && <UsagePanel records={mockUsageRecords} />}
    </div>
  )
}
