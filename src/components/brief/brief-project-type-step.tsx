"use client"

import { cn } from "@/lib/utils"
import type { ProjectType } from "@/types"
import { PROJECT_TYPE_OPTIONS } from "./project-type-config"

interface BriefProjectTypeStepProps {
  value: ProjectType | null
  onChange: (type: ProjectType) => void
}

export function BriefProjectTypeStep({ value, onChange }: BriefProjectTypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Choose a project type</h2>
        <p className="mt-1 text-sm text-slate-600">
          We tailor deliverables, review steps, and AI pipelines to the work you select.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECT_TYPE_OPTIONS.map(({ type, label, description, icon: Icon }) => {
          const selected = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                "flex flex-col rounded-xl border bg-white p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                selected
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div
                className={cn(
                  "mb-3 flex h-11 w-11 items-center justify-center rounded-lg",
                  selected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-900">{label}</span>
              <span className="mt-1 text-sm text-slate-600">{description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
