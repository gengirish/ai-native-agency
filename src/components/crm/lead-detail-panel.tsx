"use client"

import type { Lead, LeadStatus } from "@/types"
import { cn, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { ExternalLink, Mail, Phone, X } from "lucide-react"
import { STATUS_LABELS, STATUS_TOP_BORDER } from "./constants"

type LeadDetailPanelProps = {
  lead: Lead
  onClose: () => void
  onAction: (leadId: string, status: LeadStatus) => void
}

export function LeadDetailPanel({ lead, onClose, onAction }: LeadDetailPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        "border-t-4",
        STATUS_TOP_BORDER[lead.status]
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {STATUS_LABELS[lead.status]}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {lead.company}
          </h2>
          <p className="text-slate-600">{lead.contactName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 self-start rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Notes</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {lead.notes}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Contact</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="hover:text-indigo-600">
                  {lead.email}
                </a>
              </li>
              {lead.phone ? (
                <li className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">
                    {lead.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
            <span className="text-slate-500">Deal value</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(lead.value)}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
            <span className="text-slate-500">Source</span>
            <span className="font-medium text-slate-900">{lead.source}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
            <span className="text-slate-500">Created</span>
            <span className="font-medium text-slate-900">
              {formatDate(lead.createdAt)}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-2">
            <span className="text-slate-500">Last contact</span>
            <span className="font-medium text-slate-900">
              {formatDate(lead.lastContactAt)}{" "}
              <span className="font-normal text-slate-500">
                ({formatRelativeTime(lead.lastContactAt)})
              </span>
            </span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-slate-500">Next follow-up</span>
            <span className="font-medium text-slate-900">
              {lead.nextFollowUp ? formatDate(lead.nextFollowUp) : "—"}
            </span>
          </div>
          {lead.speculativeWorkUrl ? (
            <div className="rounded-lg bg-indigo-50 px-3 py-3">
              <p className="text-xs font-medium text-indigo-800">
                Speculative work
              </p>
              <a
                href={lead.speculativeWorkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:underline"
              >
                Open preview
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAction(lead.id, "demo_scheduled")}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
        >
          Schedule Demo
        </button>
        <button
          type="button"
          onClick={() => onAction(lead.id, "proposal_sent")}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
        >
          Send Proposal
        </button>
        <button
          type="button"
          onClick={() => onAction(lead.id, "won")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          Mark Won
        </button>
        <button
          type="button"
          onClick={() => onAction(lead.id, "lost")}
          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Mark Lost
        </button>
      </div>
    </div>
  )
}
