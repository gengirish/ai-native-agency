"use client"

import type { BriefWizardFormState } from "./brief-form-types"

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"

interface BriefProjectDetailsStepProps {
  form: BriefWizardFormState
  onChange: <K extends keyof BriefWizardFormState>(key: K, value: BriefWizardFormState[K]) => void
}

export function BriefProjectDetailsStep({ form, onChange }: BriefProjectDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Project details</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tell us what success looks like so experts and AI stay aligned.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label htmlFor="brief-title" className="text-sm font-medium text-slate-700">
            Project title
          </label>
          <input
            id="brief-title"
            type="text"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Q2 product launch social kit"
            className={inputClass}
          />
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="brief-description" className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="brief-description"
            rows={4}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Goals, must-haves, competitors, and any constraints."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="brief-audience" className="text-sm font-medium text-slate-700">
            Target audience
          </label>
          <input
            id="brief-audience"
            type="text"
            value={form.targetAudience}
            onChange={(e) => onChange("targetAudience", e.target.value)}
            placeholder="Who should this resonate with?"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="brief-tone" className="text-sm font-medium text-slate-700">
            Tone of voice
          </label>
          <input
            id="brief-tone"
            type="text"
            value={form.tone}
            onChange={(e) => onChange("tone", e.target.value)}
            placeholder="e.g. Bold, human, premium"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="brief-budget" className="text-sm font-medium text-slate-700">
            Budget (USD)
          </label>
          <input
            id="brief-budget"
            type="number"
            min={0}
            step={100}
            value={form.budget}
            onChange={(e) => onChange("budget", e.target.value)}
            placeholder="5000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="brief-deadline" className="text-sm font-medium text-slate-700">
            Deadline
          </label>
          <input
            id="brief-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => onChange("deadline", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
