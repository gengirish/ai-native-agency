"use client"

import { BriefBrandAssetsStep } from "@/components/brief/brief-brand-assets-step"
import { BriefDeliverablesStep } from "@/components/brief/brief-deliverables-step"
import {
  createInitialBriefFormState,
  type BriefWizardFormState,
} from "@/components/brief/brief-form-types"
import { BriefProjectDetailsStep } from "@/components/brief/brief-project-details-step"
import { BriefProjectTypeStep } from "@/components/brief/brief-project-type-step"
import { BriefReviewStep } from "@/components/brief/brief-review-step"
import { BriefStepIndicator } from "@/components/brief/brief-step-indicator"
import { BriefWizardNavigation } from "@/components/brief/brief-wizard-navigation"
import { RequireRole } from "@/components/auth/require-role"
import { DELIVERABLES_BY_TYPE } from "@/components/brief/deliverables-by-type"
import { getBrandProfiles } from "@/lib/api"
import type { BrandProfile } from "@/types"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"

const TOTAL_STEPS = 5

export default function NewBriefPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BriefWizardFormState>(createInitialBriefFormState)
  const [submitted, setSubmitted] = useState(false)
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>([])

  const prevTypeRef = useRef(form.projectType)

  useEffect(() => {
    void getBrandProfiles().then(setBrandProfiles)
  }, [])

  const updateField = useCallback(<K extends keyof BriefWizardFormState>(key: K, value: BriefWizardFormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  useEffect(() => {
    if (prevTypeRef.current === form.projectType) return
    prevTypeRef.current = form.projectType
    if (form.projectType === null) return
    setForm((f) => ({ ...f, deliverableSelection: {} }))
  }, [form.projectType])

  useEffect(() => {
    if (step !== 4 || !form.projectType) return
    const templates = DELIVERABLES_BY_TYPE[form.projectType]
    setForm((f) => {
      const hasSeeded = templates.some((t) => f.deliverableSelection[t.id] !== undefined)
      if (hasSeeded) return f
      const next = { ...f.deliverableSelection }
      templates.forEach((t) => {
        next[t.id] = { enabled: true, quantity: t.defaultQty }
      })
      return { ...f, deliverableSelection: next }
    })
  }, [step, form.projectType])

  const goNext = () => {
    if (step === TOTAL_STEPS) {
      setSubmitted(true)
      return
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const canProceed = () => {
    if (step === 1) return form.projectType !== null
    if (step === 2) return form.title.trim().length > 0
    return true
  }

  const handleDeliverableToggle = (id: string, enabled: boolean, defaultQty: number) => {
    setForm((f) => ({
      ...f,
      deliverableSelection: {
        ...f.deliverableSelection,
        [id]: {
          enabled,
          quantity: f.deliverableSelection[id]?.quantity ?? defaultQty,
        },
      },
    }))
  }

  const handleDeliverableQty = (id: string, quantity: number) => {
    setForm((f) => ({
      ...f,
      deliverableSelection: {
        ...f.deliverableSelection,
        [id]: {
          enabled: f.deliverableSelection[id]?.enabled ?? false,
          quantity,
        },
      },
    }))
  }

  return (
    <RequireRole permission="projects:create">
      {submitted ? (
        <div className="p-8">
          <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
              <span className="text-2xl" aria-hidden>
                ✓
              </span>
            </div>
            <h1 className="mt-6 text-xl font-semibold text-slate-900">Brief submitted</h1>
            <p className="mt-2 text-sm text-slate-600">
              Your brief is queued for routing. In production this would create a project and notify your team.
            </p>
            <Link
              href="/projects"
              className="mt-8 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to projects
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/projects"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              All projects
            </Link>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h1 className="text-xl font-bold text-slate-900">New project brief</h1>
              <p className="mt-1 text-sm text-slate-600">
                Step {step} of {TOTAL_STEPS} — capture scope once; AgencyOS handles the rest.
              </p>

              <BriefStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

              <div className="min-h-[280px]">
                {step === 1 && (
                  <BriefProjectTypeStep
                    value={form.projectType}
                    onChange={(type) => updateField("projectType", type)}
                  />
                )}
                {step === 2 && <BriefProjectDetailsStep form={form} onChange={updateField} />}
                {step === 3 && (
                  <BriefBrandAssetsStep form={form} brands={brandProfiles} onChange={updateField} />
                )}
                {step === 4 && form.projectType && (
                  <BriefDeliverablesStep
                    projectType={form.projectType}
                    form={form}
                    onToggle={handleDeliverableToggle}
                    onQuantityChange={handleDeliverableQty}
                  />
                )}
                {step === 5 && <BriefReviewStep form={form} brands={brandProfiles} />}
              </div>

              <BriefWizardNavigation
                showBack={step > 1}
                onBack={goBack}
                onNext={goNext}
                nextDisabled={!canProceed()}
                isLastStep={step === TOTAL_STEPS}
                nextLabel="Continue"
              />
            </div>
          </div>
        </div>
      )}
    </RequireRole>
  )
}
