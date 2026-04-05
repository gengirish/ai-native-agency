"use client"

import { useMemo, useState } from "react"
import type { Lead, LeadStatus } from "@/types"
import { mockLeads } from "@/lib/mock-data"
import { KanbanBoard } from "@/components/crm/kanban-board"
import { LeadDetailPanel } from "@/components/crm/lead-detail-panel"
import { PipelineStatsRow } from "@/components/crm/pipeline-stats"
import { SpeculativeWorkSection } from "@/components/crm/speculative-work-section"

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>(() => [...mockLeads])
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) ?? null,
    [leads, selectedLeadId]
  )

  const leadsWithSpec = useMemo(
    () => leads.filter((l) => Boolean(l.speculativeWorkUrl)),
    [leads]
  )

  function updateLeadStatus(leadId: string, status: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    )
  }

  function handleGenerateSample() {
    setWebsiteUrl((u) => u.trim())
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          CRM &amp; Sales
        </h1>
        <p className="mt-1 text-slate-600">
          Lead pipeline, speculative work, and client acquisition
        </p>
      </header>

      <div className="space-y-10">
        <PipelineStatsRow leads={leads} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Pipeline board
          </h2>
          <KanbanBoard
            leads={leads}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
          />
          {selectedLead ? (
            <LeadDetailPanel
              lead={selectedLead}
              onClose={() => setSelectedLeadId(null)}
              onAction={(id, status) => updateLeadStatus(id, status)}
            />
          ) : null}
        </section>

        <SpeculativeWorkSection
          websiteUrl={websiteUrl}
          onWebsiteUrlChange={setWebsiteUrl}
          onGenerate={handleGenerateSample}
          leadsWithSpec={leadsWithSpec}
        />
      </div>
    </div>
  )
}
