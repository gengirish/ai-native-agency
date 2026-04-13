import type {
  Project, BrandProfile, Invoice, CreditPack, Lead,
  Pipeline, AIModel, ExpertAssignment, AutonomyConfig,
  PerformanceMetric, ProactiveSuggestion, FeedbackTranslation,
  PublishingJob, ChannelConfig, Benchmark, SLATier, SLACompliance,
  RevenueMetric, CostBreakdown, Review, Deliverable, UsageRecord,
} from "@/types"
import {
  demoAIModels,
  demoAutonomyConfigs,
  demoBenchmarks,
  demoBrandProfiles,
  demoChannelConfigs,
  demoCostBreakdown,
  demoCreditPacks,
  demoDashboardStats,
  demoDeliverables,
  demoExpertAssignments,
  demoFeedbackTranslations,
  demoInvoices,
  demoLeads,
  demoPerformanceMetrics,
  demoPipelines,
  demoPublishingJobs,
  demoRevenueMetrics,
  demoReviews,
  demoSLACompliance,
  demoSLATiers,
  demoProjects,
  demoSuggestions,
  demoUsageRecords,
} from "@/lib/demo-data"

/**
 * Demo mode is on by default so the product reads as “live” in walkthroughs.
 * Set NEXT_PUBLIC_USE_DEMO_DATA=false to exercise empty states / future API wiring.
 */
function useDemoData(): boolean {
  return process.env.NEXT_PUBLIC_USE_DEMO_DATA !== "false"
}

async function demoOr<T>(data: T, empty: T): Promise<T> {
  if (!useDemoData()) return empty
  await Promise.resolve()
  return JSON.parse(JSON.stringify(data)) as T
}

export async function getProjects(): Promise<Project[]> {
  return demoOr(demoProjects, [])
}

export async function getBrandProfiles(): Promise<BrandProfile[]> {
  return demoOr(demoBrandProfiles, [])
}

export async function getInvoices(): Promise<Invoice[]> {
  return demoOr(demoInvoices, [])
}

export async function getCreditPacks(): Promise<CreditPack[]> {
  return demoOr(demoCreditPacks, [])
}

export async function getUsageRecords(): Promise<UsageRecord[]> {
  return demoOr(demoUsageRecords, [])
}

export async function getLeads(): Promise<Lead[]> {
  return demoOr(demoLeads, [])
}

export async function getPipelines(): Promise<Pipeline[]> {
  return demoOr(demoPipelines, [])
}

export async function getAIModels(): Promise<AIModel[]> {
  return demoOr(demoAIModels, [])
}

export async function getExpertAssignments(): Promise<ExpertAssignment[]> {
  return demoOr(demoExpertAssignments, [])
}

export async function getAutonomyConfigs(): Promise<AutonomyConfig[]> {
  return demoOr(demoAutonomyConfigs, [])
}

export async function getPerformanceMetrics(): Promise<PerformanceMetric[]> {
  return demoOr(demoPerformanceMetrics, [])
}

export async function getSuggestions(): Promise<ProactiveSuggestion[]> {
  return demoOr(demoSuggestions, [])
}

export async function getFeedbackTranslations(): Promise<FeedbackTranslation[]> {
  return demoOr(demoFeedbackTranslations, [])
}

export async function getPublishingJobs(): Promise<PublishingJob[]> {
  return demoOr(demoPublishingJobs, [])
}

export async function getChannelConfigs(): Promise<ChannelConfig[]> {
  return demoOr(demoChannelConfigs, [])
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  return demoOr(demoBenchmarks, [])
}

export async function getSLATiers(): Promise<SLATier[]> {
  return demoOr(demoSLATiers, [])
}

export async function getSLACompliance(): Promise<SLACompliance[]> {
  return demoOr(demoSLACompliance, [])
}

export async function getRevenueMetrics(): Promise<RevenueMetric[]> {
  return demoOr(demoRevenueMetrics, [])
}

export async function getCostBreakdown(): Promise<CostBreakdown[]> {
  return demoOr(demoCostBreakdown, [])
}

export async function getReviews(): Promise<Review[]> {
  return demoOr(demoReviews, [])
}

export async function getDeliverables(): Promise<Deliverable[]> {
  return demoOr(demoDeliverables, [])
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

const emptyDashboardStats: DashboardStats = {
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

export async function getDashboardStats(): Promise<DashboardStats> {
  return demoOr(demoDashboardStats, emptyDashboardStats)
}
