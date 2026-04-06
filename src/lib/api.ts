import type {
  Project, BrandProfile, Invoice, CreditPack, Lead,
  Pipeline, AIModel, ExpertAssignment, AutonomyConfig,
  PerformanceMetric, ProactiveSuggestion, FeedbackTranslation,
  PublishingJob, ChannelConfig, Benchmark, SLATier, SLACompliance,
  RevenueMetric, CostBreakdown, Review, Deliverable, UsageRecord,
} from "@/types"

/**
 * Typed API service layer. Returns empty collections by default.
 * Replace each function body with real fetch() calls when the backend is ready.
 */

export async function getProjects(): Promise<Project[]> { return [] }
export async function getBrandProfiles(): Promise<BrandProfile[]> { return [] }
export async function getInvoices(): Promise<Invoice[]> { return [] }
export async function getCreditPacks(): Promise<CreditPack[]> { return [] }
export async function getUsageRecords(): Promise<UsageRecord[]> { return [] }
export async function getLeads(): Promise<Lead[]> { return [] }
export async function getPipelines(): Promise<Pipeline[]> { return [] }
export async function getAIModels(): Promise<AIModel[]> { return [] }
export async function getExpertAssignments(): Promise<ExpertAssignment[]> { return [] }
export async function getAutonomyConfigs(): Promise<AutonomyConfig[]> { return [] }
export async function getPerformanceMetrics(): Promise<PerformanceMetric[]> { return [] }
export async function getSuggestions(): Promise<ProactiveSuggestion[]> { return [] }
export async function getFeedbackTranslations(): Promise<FeedbackTranslation[]> { return [] }
export async function getPublishingJobs(): Promise<PublishingJob[]> { return [] }
export async function getChannelConfigs(): Promise<ChannelConfig[]> { return [] }
export async function getBenchmarks(): Promise<Benchmark[]> { return [] }
export async function getSLATiers(): Promise<SLATier[]> { return [] }
export async function getSLACompliance(): Promise<SLACompliance[]> { return [] }
export async function getRevenueMetrics(): Promise<RevenueMetric[]> { return [] }
export async function getCostBreakdown(): Promise<CostBreakdown[]> { return [] }
export async function getReviews(): Promise<Review[]> { return [] }
export async function getDeliverables(): Promise<Deliverable[]> { return [] }

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

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
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
}
