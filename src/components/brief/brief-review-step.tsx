"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
import type { BrandProfile } from "@/types"
import { DELIVERABLES_BY_TYPE } from "./deliverables-by-type"
import type { BriefWizardFormState } from "./brief-form-types"
import { formatProjectTypeLabel } from "./project-type-config"

interface BriefReviewStepProps {
  form: BriefWizardFormState
  brands: BrandProfile[]
}

export function BriefReviewStep({ form, brands }: BriefReviewStepProps) {
  const brand = brands.find((b) => b.id === form.brandProfileId)
  const budgetNum = Number(form.budget)
  const budgetDisplay =
    form.budget !== "" && !Number.isNaN(budgetNum) ? formatCurrency(budgetNum) : "—"
  const deadlineDisplay = form.deadline ? formatDate(form.deadline) : "—"

  const selectedDeliverables =
    form.projectType &&
    DELIVERABLES_BY_TYPE[form.projectType]?.filter(
      (d) => form.deliverableSelection[d.id]?.enabled
    )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Review & submit</h2>
        <p className="mt-1 text-sm text-slate-600">
          Confirm everything below. You can go back to edit any step before submitting.
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project type</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">
            {form.projectType ? formatProjectTypeLabel(form.projectType) : "—"}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">{form.title || "—"}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{form.description || "—"}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audience</dt>
          <dd className="mt-1 text-sm text-slate-900">{form.targetAudience || "—"}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tone</dt>
          <dd className="mt-1 text-sm text-slate-900">{form.tone || "—"}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget</dt>
          <dd className="mt-1 text-sm text-slate-900">{budgetDisplay}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deadline</dt>
          <dd className="mt-1 text-sm text-slate-900">{deadlineDisplay}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Brand profile</dt>
          <dd className="mt-1 text-sm text-slate-900">{brand?.name ?? "None selected"}</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accent color</dt>
          <dd className="mt-2 flex items-center gap-3">
            <span
              className="inline-block h-10 w-10 rounded-lg border border-slate-200 shadow-sm"
              style={{ backgroundColor: form.brandColorHex }}
            />
            <span className="font-mono text-sm text-slate-800">{form.brandColorHex}</span>
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference files</dt>
          <dd className="mt-1 text-sm text-slate-700">
            {form.referenceFileNames.length ? form.referenceFileNames.join(", ") : "None"}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deliverables</dt>
          <dd className="mt-2">
            {selectedDeliverables?.length ? (
              <ul className="space-y-1 text-sm text-slate-800">
                {selectedDeliverables.map((d) => (
                  <li key={d.id}>
                    {d.label}{" "}
                    <span className="text-slate-500">
                      ×{form.deliverableSelection[d.id]?.quantity ?? d.defaultQty}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-slate-500">No deliverables selected</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  )
}
