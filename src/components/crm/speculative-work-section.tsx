"use client"

import type { Lead } from "@/types"
import { ExternalLink, Sparkles } from "lucide-react"

type SpeculativeWorkSectionProps = {
  websiteUrl: string
  onWebsiteUrlChange: (value: string) => void
  onGenerate: () => void
  leadsWithSpec: Lead[]
}

export function SpeculativeWorkSection({
  websiteUrl,
  onWebsiteUrlChange,
  onGenerate,
  leadsWithSpec,
}: SpeculativeWorkSectionProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Sparkles className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Speculative work
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                Enter a prospect&apos;s website URL. We&apos;ll auto-extract their
                brand and generate sample deliverables in 60 seconds — the killer
                sales demo.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="spec-website-url"
              className="block text-xs font-medium text-slate-600"
            >
              Company website URL
            </label>
            <input
              id="spec-website-url"
              type="url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => onWebsiteUrlChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-indigo-500/0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="button"
            onClick={onGenerate}
            className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Generate Sample Work
          </button>
        </div>
      </div>

      {leadsWithSpec.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Leads with speculative previews
          </h3>
          <ul className="mt-3 space-y-2">
            {leadsWithSpec.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{lead.company}</p>
                  <p className="text-xs text-slate-500">{lead.contactName}</p>
                </div>
                {lead.speculativeWorkUrl ? (
                  <a
                    href={lead.speculativeWorkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    Preview
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
