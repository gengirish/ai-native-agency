"use client"

import { useState, useEffect, useMemo } from "react"
import type { Lead, LeadStatus } from "@/types"
import { RequireRole } from "@/components/auth/require-role"
import { KanbanBoard } from "@/components/crm/kanban-board"
import { LeadDetailPanel } from "@/components/crm/lead-detail-panel"
import { PipelineStatsRow } from "@/components/crm/pipeline-stats"
import { SpeculativeWorkSection } from "@/components/crm/speculative-work-section"
import { EmptyState } from "@/components/ui/empty-state"
import {
  createProject,
  generateDeliverable,
  getLeads,
  patchLead,
  updateLeadStatus as apiUpdateLeadStatus,
} from "@/lib/api"

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [specGenerating, setSpecGenerating] = useState(false)
  const [specError, setSpecError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getLeads()
      .then((data) => {
        if (!cancelled) setLeads(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
    void apiUpdateLeadStatus(leadId, status)
  }

  async function handleGenerateSample() {
    if (!selectedLead) {
      setSpecError("Select a lead on the pipeline board first.")
      return
    }
    const url = websiteUrl.trim()
    setSpecGenerating(true)
    setSpecError(null)
    try {
      const due = new Date()
      due.setDate(due.getDate() + 14)
      const dueStr = due.toISOString().split("T")[0] ?? ""
      const title = `${selectedLead.company} — speculative sample`
      const description = [
        `Prospect: ${selectedLead.contactName} (${selectedLead.email}).`,
        selectedLead.notes ? `Notes: ${selectedLead.notes}` : null,
        url ? `Website: ${url}` : null,
      ]
        .filter(Boolean)
        .join("\n")

      const project = await createProject({
        title,
        type: "brand_identity",
        clientName: selectedLead.company,
        dueDate: dueStr,
        budget: selectedLead.value > 0 ? selectedLead.value : undefined,
      })
      if (!project) {
        setSpecError("Could not create project. Try signing in again.")
        return
      }

      const gen = await generateDeliverable({
        projectId: project.id,
        title,
        type: "brand_identity",
        description,
        clientName: selectedLead.company,
        budget: selectedLead.value > 0 ? selectedLead.value : undefined,
      })
      if (!gen) {
        setSpecError("Generation failed. Open the project to retry or check API keys.")
        return
      }

      const speculativeWorkUrl = `/projects/${project.id}/generated`
      const updated = await patchLead(selectedLead.id, { speculativeWorkUrl })
      if (!updated) {
        setSpecError("Work was generated but the lead record could not be updated.")
        return
      }

      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
      setWebsiteUrl((u) => u.trim())
    } catch {
      setSpecError("Something went wrong. Please try again.")
    } finally {
      setSpecGenerating(false)
    }
  }

  return (
    <RequireRole permission="crm:view">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            CRM &amp; Sales
          </h1>
          <p className="mt-1 text-slate-600">
            Lead pipeline, speculative work, and client acquisition
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads yet"
            description="Add your first lead to start tracking your pipeline."
          />
        ) : (
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
              onGenerate={() => void handleGenerateSample()}
              leadsWithSpec={leadsWithSpec}
              selectedLeadLabel={
                selectedLead ? `${selectedLead.company} (${selectedLead.contactName})` : null
              }
              generating={specGenerating}
              errorMessage={specError}
            />
          </div>
        )}
      </div>
    </RequireRole>
  )
}
