/**
 * In-memory mutable store seeded from demo data.
 * On Vercel serverless this resets per cold start — fine for demos.
 * Replace with Postgres/KV when wiring a real backend.
 */
import type {
  Project, BrandProfile, Invoice, CreditPack, Lead,
  Pipeline, AIModel, ExpertAssignment, AutonomyConfig,
  PerformanceMetric, ProactiveSuggestion, FeedbackTranslation,
  PublishingJob, ChannelConfig, Benchmark, SLATier, SLACompliance,
  RevenueMetric, CostBreakdown, Review, Deliverable, UsageRecord,
  User,
} from "@/types"
import {
  demoAIModels, demoAutonomyConfigs, demoBenchmarks, demoBrandProfiles,
  demoChannelConfigs, demoCostBreakdown, demoCreditPacks, demoDashboardStats,
  demoDeliverables, demoExpertAssignments, demoFeedbackTranslations,
  demoInvoices, demoLeads, demoPerformanceMetrics, demoPipelines,
  demoPublishingJobs, demoRevenueMetrics, demoReviews, demoProjects,
  demoSLACompliance, demoSLATiers, demoSuggestions, demoUsageRecords,
} from "./demo-data"

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

interface Store {
  projects: Project[]
  deliverables: Deliverable[]
  reviews: Review[]
  expertAssignments: ExpertAssignment[]
  revenueMetrics: RevenueMetric[]
  costBreakdown: CostBreakdown[]
  leads: Lead[]
  pipelines: Pipeline[]
  aiModels: AIModel[]
  autonomyConfigs: AutonomyConfig[]
  performanceMetrics: PerformanceMetric[]
  suggestions: ProactiveSuggestion[]
  feedbackTranslations: FeedbackTranslation[]
  publishingJobs: PublishingJob[]
  channelConfigs: ChannelConfig[]
  benchmarks: Benchmark[]
  slaTiers: SLATier[]
  slaCompliance: SLACompliance[]
  invoices: Invoice[]
  creditPacks: CreditPack[]
  usageRecords: UsageRecord[]
  brandProfiles: BrandProfile[]
  dashboardStats: typeof demoDashboardStats
  users: (User & { password: string })[]
}

const SEED_USERS: Store["users"] = [
  {
    id: "u_admin",
    name: "Priya Kapoor",
    email: "admin@agencyos.demo",
    password: "demo123",
    role: "admin",
    tenantId: "t_demo",
    specialty: "Agency Operations",
    createdAt: "2025-06-01T00:00:00.000Z",
  },
  {
    id: "exp_maya",
    name: "Maya Okonkwo",
    email: "maya@agencyos.demo",
    password: "demo123",
    role: "expert",
    tenantId: "t_demo",
    specialty: "Brand & Identity Design",
    createdAt: "2025-07-15T00:00:00.000Z",
  },
  {
    id: "exp_jordan",
    name: "Jordan Lee",
    email: "jordan@agencyos.demo",
    password: "demo123",
    role: "expert",
    tenantId: "t_demo",
    specialty: "Motion & Social Media",
    createdAt: "2025-08-01T00:00:00.000Z",
  },
  {
    id: "u_client_lumen",
    name: "Sarah Chen",
    email: "sarah@agencyos.demo",
    password: "demo123",
    role: "client",
    tenantId: "t_demo",
    createdAt: "2025-09-10T00:00:00.000Z",
  },
]

function createStore(): Store {
  return {
    projects: clone(demoProjects),
    deliverables: clone(demoDeliverables),
    reviews: clone(demoReviews),
    expertAssignments: clone(demoExpertAssignments),
    revenueMetrics: clone(demoRevenueMetrics),
    costBreakdown: clone(demoCostBreakdown),
    leads: clone(demoLeads),
    pipelines: clone(demoPipelines),
    aiModels: clone(demoAIModels),
    autonomyConfigs: clone(demoAutonomyConfigs),
    performanceMetrics: clone(demoPerformanceMetrics),
    suggestions: clone(demoSuggestions),
    feedbackTranslations: clone(demoFeedbackTranslations),
    publishingJobs: clone(demoPublishingJobs),
    channelConfigs: clone(demoChannelConfigs),
    benchmarks: clone(demoBenchmarks),
    slaTiers: clone(demoSLATiers),
    slaCompliance: clone(demoSLACompliance),
    invoices: clone(demoInvoices),
    creditPacks: clone(demoCreditPacks),
    usageRecords: clone(demoUsageRecords),
    brandProfiles: clone(demoBrandProfiles),
    dashboardStats: clone(demoDashboardStats),
    users: clone(SEED_USERS),
  }
}

const g = globalThis as unknown as { __agencyos_store?: Store }
if (!g.__agencyos_store) {
  g.__agencyos_store = createStore()
}

export const store: Store = g.__agencyos_store

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
