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
    users: [],
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
