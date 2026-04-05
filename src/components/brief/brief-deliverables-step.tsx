"use client"

import type { ProjectType } from "@/types"
import { cn } from "@/lib/utils"
import { DELIVERABLES_BY_TYPE } from "./deliverables-by-type"
import type { BriefWizardFormState } from "./brief-form-types"

const inputQtyClass =
  "w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"

interface BriefDeliverablesStepProps {
  projectType: ProjectType
  form: BriefWizardFormState
  onToggle: (id: string, enabled: boolean, defaultQty: number) => void
  onQuantityChange: (id: string, quantity: number) => void
}

export function BriefDeliverablesStep({
  projectType,
  form,
  onToggle,
  onQuantityChange,
}: BriefDeliverablesStepProps) {
  const items = DELIVERABLES_BY_TYPE[projectType] ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Deliverables</h2>
        <p className="mt-1 text-sm text-slate-600">
          Check what you need and set quantities. Defaults are tuned for this project type.
        </p>
      </div>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.map(({ id, label, defaultQty }) => {
          const row = form.deliverableSelection[id]
          const enabled = row?.enabled ?? false
          const qty = row?.quantity ?? defaultQty
          return (
            <li key={id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onToggle(id, e.target.checked, defaultQty)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-900">{label}</span>
              </label>
              <div className="flex items-center gap-2 pl-7 sm:pl-0">
                <span className="text-xs text-slate-500">Qty</span>
                <input
                  type="number"
                  min={1}
                  disabled={!enabled}
                  value={qty}
                  onChange={(e) => onQuantityChange(id, Math.max(1, Number(e.target.value) || 1))}
                  className={cn(inputQtyClass, !enabled && "cursor-not-allowed opacity-50")}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
