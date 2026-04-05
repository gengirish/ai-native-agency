"use client"

import type { ChangeEvent } from "react"
import type { BrandProfile } from "@/types"
import { cn } from "@/lib/utils"
import { ImagePlus, Upload } from "lucide-react"
import type { BriefWizardFormState } from "./brief-form-types"

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"

interface BriefBrandAssetsStepProps {
  form: BriefWizardFormState
  brands: BrandProfile[]
  onChange: <K extends keyof BriefWizardFormState>(key: K, value: BriefWizardFormState[K]) => void
}

export function BriefBrandAssetsStep({ form, brands, onChange }: BriefBrandAssetsStepProps) {
  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const names = Array.from(files).map((f) => f.name)
    onChange("referenceFileNames", [...form.referenceFileNames, ...names])
    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Brand & assets</h2>
        <p className="mt-1 text-sm text-slate-600">
          Link an existing brand profile, add references, and pick a hero color for this brief.
        </p>
      </div>
      <div>
        <label htmlFor="brief-brand-profile" className="text-sm font-medium text-slate-700">
          Brand profile
        </label>
        <select
          id="brief-brand-profile"
          value={form.brandProfileId}
          onChange={(e) => onChange("brandProfileId", e.target.value)}
          className={inputClass}
        >
          <option value="">Select a brand…</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="text-sm font-medium text-slate-700">Reference images</span>
        <p className="mt-0.5 text-xs text-slate-500">Mock upload — files are not sent anywhere.</p>
        <label
          htmlFor="brief-ref-upload"
          className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30"
        >
          <Upload className="mb-2 h-8 w-8 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Drop files or click to browse</span>
          <span className="mt-1 text-xs text-slate-500">PNG, JPG, SVG up to 25MB (simulated)</span>
          <input
            id="brief-ref-upload"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFilePick}
          />
        </label>
        {form.referenceFileNames.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {form.referenceFileNames.map((name) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm"
              >
                <ImagePlus className="h-3.5 w-3.5 text-indigo-500" />
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="brief-brand-color" className="text-sm font-medium text-slate-700">
          Primary accent color
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <input
            id="brief-brand-color"
            type="color"
            value={form.brandColorHex}
            onChange={(e) => onChange("brandColorHex", e.target.value)}
            className="h-12 w-20 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
          />
          <input
            type="text"
            value={form.brandColorHex}
            onChange={(e) => onChange("brandColorHex", e.target.value)}
            placeholder="#4F46E5"
            className={cn(inputClass, "max-w-[140px]")}
          />
          <div className="flex flex-wrap gap-2">
            {["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#1E293B"].map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onChange("brandColorHex", hex)}
                className={cn(
                  "h-9 w-9 rounded-lg border-2 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  form.brandColorHex.toLowerCase() === hex.toLowerCase()
                    ? "border-indigo-600 ring-2 ring-indigo-100"
                    : "border-white"
                )}
                style={{ backgroundColor: hex }}
                title={hex}
                aria-label={`Use color ${hex}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
