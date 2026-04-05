import type { ProjectType } from "@/types"

export interface BriefWizardFormState {
  projectType: ProjectType | null
  title: string
  description: string
  targetAudience: string
  tone: string
  budget: string
  deadline: string
  brandProfileId: string
  referenceFileNames: string[]
  brandColorHex: string
  deliverableSelection: Record<string, { enabled: boolean; quantity: number }>
}

export function createInitialBriefFormState(): BriefWizardFormState {
  return {
    projectType: null,
    title: "",
    description: "",
    targetAudience: "",
    tone: "",
    budget: "",
    deadline: "",
    brandProfileId: "",
    referenceFileNames: [],
    brandColorHex: "#4F46E5",
    deliverableSelection: {},
  }
}
