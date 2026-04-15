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
import { createProject, generateDeliverable, getBrandProfiles } from "@/lib/api"
import { useAuth } from "@/lib/auth/context"
import type { BrandProfile } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft } from "lucide-react"

const GEN_FAILED_FLAG = "agencyos:gen-failed"

function parseBudgetAmount(raw: string): number | undefined {
  const cleaned = raw.replace(/[$,\s]/g, "").trim()
  if (!cleaned) return undefined
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : undefined
}

const TOTAL_STEPS = 5

export default function NewBriefPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BriefWizardFormState>(createInitialBriefFormState)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
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

  const submitBrief = useCallback(async () => {
    if (submitting) return
    if (!form.projectType) {
      setSubmitError("Choose a project type before submitting.")
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    const clientName = user?.name?.trim() || "Demo Client"
    const dueDate = form.deadline.trim() || new Date().toISOString()
    const budget = parseBudgetAmount(form.budget)
    const project = await createProject({
      title: form.title.trim(),
      type: form.projectType,
      priority: "medium",
      clientName,
      dueDate,
      ...(budget !== undefined ? { budget } : {}),
    })
    if (!project) {
      setSubmitting(false)
      setSubmitError("Could not create the project. Please try again.")
      return
    }

    const genResult = await generateDeliverable({
      projectId: project.id,
      title: project.title,
      type: form.projectType,
      description: form.description,
      clientName,
      budget,
    })

    setSubmitting(false)

    if (genResult) {
      try {
        sessionStorage.setItem("agencyos:gen-result", JSON.stringify(genResult))
        sessionStorage.setItem("agencyos:brief-created", "1")
      } catch { /* private mode */ }
      router.push(`/projects/${project.id}/generated`)
    } else {
      try {
        sessionStorage.setItem(GEN_FAILED_FLAG, "1")
      } catch { /* private mode */ }
      router.push("/projects")
    }
  }, [form.budget, form.deadline, form.description, form.projectType, form.title, router, submitting, user?.name])

  const goNext = () => {
    if (step === TOTAL_STEPS) {
      void submitBrief()
      return
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const goBack = () => {
    if (submitting) return
    setStep((s) => Math.max(1, s - 1))
  }

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

              {submitError ? (
                <p
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                  role="alert"
                >
                  {submitError}
                </p>
              ) : null}

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
                nextDisabled={!canProceed() || submitting}
                isLastStep={step === TOTAL_STEPS}
                isSubmitting={submitting}
                nextLabel={submitting ? "Generating with AI..." : "Continue"}
              />
            </div>
          </div>
        </div>
    </RequireRole>
  )
}
