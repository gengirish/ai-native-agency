import { getToken } from "@/lib/auth/context"
import type {
  Project,
  ProjectPriority,
  ProjectType,
  BrandProfile,
  Invoice,
  CreditPack,
  Lead,
  LeadStatus,
  Pipeline,
  AIModel,
  ExpertAssignment,
  AutonomyConfig,
  PerformanceMetric,
  ProactiveSuggestion,
  FeedbackTranslation,
  PublishingJob,
  ChannelConfig,
  Benchmark,
  SLATier,
  SLACompliance,
  RevenueMetric,
  CostBreakdown,
  Review,
  Deliverable,
  UsageRecord,
} from "@/types"

function authHeadersJson(): HeadersInit {
  const token = typeof window !== "undefined" ? getToken() : null
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readDataArray<T>(json: unknown): T[] {
  if (!isRecord(json)) return []
  const data = json.data
  return Array.isArray(data) ? (data as T[]) : []
}

async function fetchDataArray<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(path)
    if (!res.ok) return []
    const json: unknown = await res.json()
    return readDataArray<T>(json)
  } catch {
    return []
  }
}

type BillingBundle = {
  invoices: Invoice[]
  creditPacks: CreditPack[]
  usage: UsageRecord[]
}

let billingInflight: Promise<BillingBundle> | null = null

async function loadBilling(): Promise<BillingBundle> {
  if (!billingInflight) {
    billingInflight = (async (): Promise<BillingBundle> => {
      try {
        const res = await fetch("/api/billing")
        if (!res.ok) {
          return { invoices: [], creditPacks: [], usage: [] }
        }
        const json: unknown = await res.json()
        if (!isRecord(json)) {
          return { invoices: [], creditPacks: [], usage: [] }
        }
        return {
          invoices: Array.isArray(json.invoices)
            ? (json.invoices as Invoice[])
            : [],
          creditPacks: Array.isArray(json.creditPacks)
            ? (json.creditPacks as CreditPack[])
            : [],
          usage: Array.isArray(json.usage)
            ? (json.usage as UsageRecord[])
            : [],
        }
      } catch {
        return { invoices: [], creditPacks: [], usage: [] }
      }
    })().finally(() => {
      billingInflight = null
    })
  }
  return billingInflight
}

type PublishingBundle = {
  jobs: PublishingJob[]
  channels: ChannelConfig[]
}

let publishingInflight: Promise<PublishingBundle> | null = null

async function loadPublishing(): Promise<PublishingBundle> {
  if (!publishingInflight) {
    publishingInflight = (async (): Promise<PublishingBundle> => {
      try {
        const res = await fetch("/api/publishing")
        if (!res.ok) {
          return { jobs: [], channels: [] }
        }
        const json: unknown = await res.json()
        if (!isRecord(json)) {
          return { jobs: [], channels: [] }
        }
        return {
          jobs: Array.isArray(json.jobs) ? (json.jobs as PublishingJob[]) : [],
          channels: Array.isArray(json.channels)
            ? (json.channels as ChannelConfig[])
            : [],
        }
      } catch {
        return { jobs: [], channels: [] }
      }
    })().finally(() => {
      publishingInflight = null
    })
  }
  return publishingInflight
}

type SlaBundle = {
  tiers: SLATier[]
  compliance: SLACompliance[]
}

let slaInflight: Promise<SlaBundle> | null = null

async function loadSla(): Promise<SlaBundle> {
  if (!slaInflight) {
    slaInflight = (async (): Promise<SlaBundle> => {
      try {
        const res = await fetch("/api/sla")
        if (!res.ok) {
          return { tiers: [], compliance: [] }
        }
        const json: unknown = await res.json()
        if (!isRecord(json)) {
          return { tiers: [], compliance: [] }
        }
        return {
          tiers: Array.isArray(json.tiers) ? (json.tiers as SLATier[]) : [],
          compliance: Array.isArray(json.compliance)
            ? (json.compliance as SLACompliance[])
            : [],
        }
      } catch {
        return { tiers: [], compliance: [] }
      }
    })().finally(() => {
      slaInflight = null
    })
  }
  return slaInflight
}

export async function getProjects(): Promise<Project[]> {
  return fetchDataArray<Project>("/api/projects")
}

export async function getBrandProfiles(): Promise<BrandProfile[]> {
  return fetchDataArray<BrandProfile>("/api/brands")
}

export async function getInvoices(): Promise<Invoice[]> {
  const { invoices } = await loadBilling()
  return invoices
}

export async function getCreditPacks(): Promise<CreditPack[]> {
  const { creditPacks } = await loadBilling()
  return creditPacks
}

export async function getUsageRecords(): Promise<UsageRecord[]> {
  const { usage } = await loadBilling()
  return usage
}

export async function getLeads(): Promise<Lead[]> {
  return fetchDataArray<Lead>("/api/leads")
}

export async function getPipelines(): Promise<Pipeline[]> {
  return fetchDataArray<Pipeline>("/api/pipelines")
}

export async function getAIModels(): Promise<AIModel[]> {
  return fetchDataArray<AIModel>("/api/models")
}

export async function getExpertAssignments(): Promise<ExpertAssignment[]> {
  return fetchDataArray<ExpertAssignment>("/api/experts")
}

export async function getAutonomyConfigs(): Promise<AutonomyConfig[]> {
  return fetchDataArray<AutonomyConfig>("/api/autonomy")
}

export async function getPerformanceMetrics(): Promise<PerformanceMetric[]> {
  return fetchDataArray<PerformanceMetric>("/api/performance")
}

export async function getSuggestions(): Promise<ProactiveSuggestion[]> {
  return fetchDataArray<ProactiveSuggestion>("/api/suggestions")
}

export async function getFeedbackTranslations(): Promise<FeedbackTranslation[]> {
  return fetchDataArray<FeedbackTranslation>("/api/feedback")
}

export async function getPublishingJobs(): Promise<PublishingJob[]> {
  const { jobs } = await loadPublishing()
  return jobs
}

export async function getChannelConfigs(): Promise<ChannelConfig[]> {
  const { channels } = await loadPublishing()
  return channels
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  return fetchDataArray<Benchmark>("/api/benchmarks")
}

export async function getSLATiers(): Promise<SLATier[]> {
  const { tiers } = await loadSla()
  return tiers
}

export async function getSLACompliance(): Promise<SLACompliance[]> {
  const { compliance } = await loadSla()
  return compliance
}

export async function getRevenueMetrics(): Promise<RevenueMetric[]> {
  return fetchDataArray<RevenueMetric>("/api/revenue")
}

export async function getCostBreakdown(): Promise<CostBreakdown[]> {
  return fetchDataArray<CostBreakdown>("/api/costs")
}

export async function getReviews(): Promise<Review[]> {
  return fetchDataArray<Review>("/api/reviews")
}

export async function getDeliverables(): Promise<Deliverable[]> {
  return fetchDataArray<Deliverable>("/api/deliverables")
}

export interface DashboardStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  activeProjects: number
  totalProjects: number
  avgMargin: number
  avgQualityScore: number
  avgTurnaround: number
  totalClients: number
  activeClients: number
  pipelineValue: number
  expertUtilization: number
  autonomousRate: number
  aiCostPerProject: number
}

export const emptyDashboardStats: DashboardStats = {
  totalRevenue: 0,
  monthlyRevenue: 0,
  revenueGrowth: 0,
  activeProjects: 0,
  totalProjects: 0,
  avgMargin: 0,
  avgQualityScore: 0,
  avgTurnaround: 0,
  totalClients: 0,
  activeClients: 0,
  pipelineValue: 0,
  expertUtilization: 0,
  autonomousRate: 0,
  aiCostPerProject: 0,
}

function isDashboardStats(value: unknown): value is DashboardStats {
  if (!isRecord(value)) return false
  const keys: (keyof DashboardStats)[] = [
    "totalRevenue",
    "monthlyRevenue",
    "revenueGrowth",
    "activeProjects",
    "totalProjects",
    "avgMargin",
    "avgQualityScore",
    "avgTurnaround",
    "totalClients",
    "activeClients",
    "pipelineValue",
    "expertUtilization",
    "autonomousRate",
    "aiCostPerProject",
  ]
  return keys.every((k) => typeof value[k] === "number")
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch("/api/dashboard/stats")
    if (!res.ok) return emptyDashboardStats
    const json: unknown = await res.json()
    if (!isRecord(json)) return emptyDashboardStats
    const data = json.data
    if (!isDashboardStats(data)) return emptyDashboardStats
    return data
  } catch {
    return emptyDashboardStats
  }
}

export interface CreateProjectInput {
  title: string
  type: ProjectType
  priority?: ProjectPriority
  clientName: string
  dueDate?: string
  budget?: number
}

export async function createProject(input: CreateProjectInput): Promise<Project | null> {
  try {
    const body: Record<string, unknown> = {
      title: input.title,
      type: input.type,
      priority: input.priority ?? "medium",
      clientName: input.clientName,
      dueDate: input.dueDate,
    }
    if (typeof input.budget === "number" && Number.isFinite(input.budget)) {
      body.budget = input.budget
    }
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: authHeadersJson(),
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (!isRecord(json) || json.data === undefined || json.data === null) {
      return null
    }
    return json.data as Project
  } catch {
    return null
  }
}

export async function updateProjectStatus(
  id: string,
  status: string,
): Promise<Project | null> {
  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (!isRecord(json) || json.data === undefined || json.data === null) {
      return null
    }
    return json.data as Project
  } catch {
    return null
  }
}

export async function updateReview(
  id: string,
  patch: { status?: string; rating?: number },
): Promise<Review | null> {
  try {
    const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (!isRecord(json)) return null
    return json as unknown as Review
  } catch {
    return null
  }
}

export async function addReviewComment(
  reviewId: string,
  comment: { author: string; authorRole: string; content: string },
): Promise<unknown> {
  try {
    const res = await fetch(
      `/api/reviews/${encodeURIComponent(reviewId)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      },
    )
    if (!res.ok) return null
    return (await res.json()) as unknown
  } catch {
    return null
  }
}

export interface GenerateInput {
  projectId: string
  title: string
  type: ProjectType
  description?: string
  clientName?: string
  budget?: number
}

export interface GenerationResult {
  deliverable: {
    id: string
    projectId: string
    title: string
    type: string
    aiModel: string
    generationCost: number
    generationTime: number
  }
  generation: {
    content: string
    model: string
    provider: string
    tokensUsed: number
    latencyMs: number
    cost: number
  }
}

export async function generateDeliverable(
  input: GenerateInput,
): Promise<GenerationResult | null> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: authHeadersJson(),
      body: JSON.stringify(input),
    })
    if (!res.ok) return null
    return (await res.json()) as GenerationResult
  } catch {
    return null
  }
}

export async function updateLeadStatus(
  id: string,
  status: string,
): Promise<Lead | null> {
  try {
    const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: authHeadersJson(),
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (!isRecord(json) || json.data === undefined || json.data === null) {
      return null
    }
    return json.data as Lead
  } catch {
    return null
  }
}

export async function patchLead(
  id: string,
  patch: {
    status?: LeadStatus
    notes?: string
    nextFollowUp?: string
    speculativeWorkUrl?: string
  },
): Promise<Lead | null> {
  try {
    const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: authHeadersJson(),
      body: JSON.stringify(patch),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (!isRecord(json) || json.data === undefined || json.data === null) {
      return null
    }
    return json.data as Lead
  } catch {
    return null
  }
}
