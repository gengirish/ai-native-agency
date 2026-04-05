export type UserRole = "admin" | "expert" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  tenantId: string
  specialty?: string
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  logo?: string
  plan: PricingTier
  createdAt: string
}

export type ProjectStatus =
  | "draft"
  | "submitted"
  | "ai_generating"
  | "qa_check"
  | "expert_review"
  | "client_review"
  | "revision"
  | "approved"
  | "delivered"

export type ProjectType =
  | "logo_design"
  | "social_media"
  | "brand_identity"
  | "marketing_collateral"
  | "video_ad"
  | "legal_document"
  | "blog_content"
  | "email_campaign"
  | "ad_creative"

export type ProjectPriority = "low" | "medium" | "high" | "urgent"

export interface Project {
  id: string
  title: string
  type: ProjectType
  status: ProjectStatus
  priority: ProjectPriority
  clientId: string
  clientName: string
  briefId?: string
  expertId?: string
  estimatedCost: number
  actualCost: number
  aiCost: number
  confidenceScore: number
  autonomyLevel: AutonomyLevel
  qualityScore: number
  dueDate: string
  createdAt: string
  updatedAt: string
  deliverableCount: number
  revisionCount: number
}

export interface Brief {
  id: string
  projectId: string
  projectType: ProjectType
  title: string
  description: string
  fields: BriefField[]
  brandProfileId?: string
  referenceImages: string[]
  targetAudience: string
  tone: string
  deliverables: string[]
  deadline: string
  budget: number
  submittedAt: string
}

export interface BriefField {
  key: string
  label: string
  value: string
  type: "text" | "textarea" | "select" | "color" | "file" | "number"
  required: boolean
}

export type DeliverableStatus = "generating" | "qa_check" | "review" | "approved" | "rejected" | "revision"

export interface Deliverable {
  id: string
  projectId: string
  version: number
  title: string
  type: string
  fileUrl: string
  thumbnailUrl: string
  status: DeliverableStatus
  aiModel: string
  generationCost: number
  generationTime: number
  qualityScore: number
  createdAt: string
}

export type ReviewStatus = "pending" | "approved" | "revision_requested" | "rejected"

export interface Review {
  id: string
  deliverableId: string
  projectId: string
  reviewerId: string
  reviewerName: string
  reviewerRole: UserRole
  status: ReviewStatus
  rating: number
  comments: ReviewComment[]
  timeSpent: number
  createdAt: string
}

export interface ReviewComment {
  id: string
  author: string
  authorRole: UserRole
  content: string
  position?: { x: number; y: number }
  createdAt: string
}

export type AIProvider = "openai" | "anthropic" | "midjourney" | "runway" | "elevenlabs" | "replicate" | "flux"

export interface AIModel {
  id: string
  provider: AIProvider
  name: string
  capabilities: string[]
  costPer1kTokens: number
  avgLatencyMs: number
  qualityScore: number
  isActive: boolean
}

export type AITaskStatus = "queued" | "running" | "completed" | "failed" | "retrying"

export interface AITask {
  id: string
  pipelineId: string
  type: string
  modelId: string
  modelName: string
  status: AITaskStatus
  input: string
  output?: string
  cost: number
  latencyMs: number
  retryCount: number
  createdAt: string
  completedAt?: string
}

export interface Pipeline {
  id: string
  projectId: string
  projectTitle: string
  tasks: AITask[]
  status: "running" | "completed" | "failed" | "paused"
  totalCost: number
  totalTime: number
  startedAt: string
  completedAt?: string
}

export type EscalationLevel = "standard" | "senior" | "manual_required"

export interface ExpertAssignment {
  id: string
  projectId: string
  projectTitle: string
  projectType: ProjectType
  expertId: string
  expertName: string
  status: "queued" | "claimed" | "in_review" | "completed" | "escalated"
  escalationLevel: EscalationLevel
  priority: ProjectPriority
  claimedAt?: string
  completedAt?: string
  reviewTimeMinutes: number
  qualityBefore: number
  qualityAfter: number
}

export interface BrandProfile {
  id: string
  tenantId: string
  name: string
  websiteUrl: string
  logoUrl: string
  colors: BrandColor[]
  fonts: BrandFont[]
  toneOfVoice: string
  values: string[]
  targetAudience: string
  industry: string
  competitors: string[]
  assets: BrandAsset[]
  dnaScore: number
  projectsCompleted: number
  lastUpdated: string
}

export interface BrandColor {
  name: string
  hex: string
  usage: "primary" | "secondary" | "accent" | "neutral"
}

export interface BrandFont {
  name: string
  usage: "heading" | "body" | "accent"
  weight: string
}

export interface BrandAsset {
  id: string
  type: "logo" | "icon" | "pattern" | "photo" | "template"
  url: string
  name: string
  tags: string[]
}

export type PricingTier = "starter" | "professional" | "enterprise"
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface Invoice {
  id: string
  tenantId: string
  clientName: string
  amount: number
  status: InvoiceStatus
  items: InvoiceItem[]
  createdAt: string
  dueDate: string
  paidAt?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  price: number
  pricePerCredit: number
  popular: boolean
  features: string[]
}

export interface UsageRecord {
  tenantId: string
  month: string
  projectsCompleted: number
  creditsUsed: number
  creditsRemaining: number
  totalSpend: number
  aiCost: number
  margin: number
}

export type LeadStatus = "new" | "contacted" | "demo_scheduled" | "proposal_sent" | "negotiating" | "won" | "lost"

export interface Lead {
  id: string
  company: string
  contactName: string
  email: string
  phone?: string
  status: LeadStatus
  value: number
  source: string
  notes: string
  speculativeWorkUrl?: string
  createdAt: string
  lastContactAt: string
  nextFollowUp?: string
}

export type AutonomyLevel = "human_required" | "spot_check" | "autonomous"

export interface AutonomyConfig {
  id: string
  taskType: ProjectType
  taskLabel: string
  currentLevel: AutonomyLevel
  confidenceScore: number
  totalCompleted: number
  successRate: number
  revisionRate: number
  avgQualityScore: number
  lastEscalation?: string
  trend: "improving" | "stable" | "declining"
  projectedAutonomyDate?: string
}

export interface PerformanceMetric {
  id: string
  deliverableId: string
  projectTitle: string
  channel: PublishingChannel
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  spend: number
  roi: number
  measuredAt: string
}

export type SuggestionStatus = "pending" | "accepted" | "rejected" | "generated"

export interface ProactiveSuggestion {
  id: string
  tenantId: string
  clientName: string
  type: ProjectType
  title: string
  description: string
  reasoning: string
  previewUrl?: string
  trendSource: string
  relevanceScore: number
  estimatedValue: number
  status: SuggestionStatus
  createdAt: string
  expiresAt: string
}

export interface FeedbackTranslation {
  id: string
  original: string
  translated: string
  confidence: number
  actionableItems: ActionableItem[]
  category: "aesthetic" | "content" | "layout" | "color" | "typography" | "general"
}

export interface ActionableItem {
  action: string
  parameter: string
  value: string
  priority: "high" | "medium" | "low"
}

export type PublishingChannel = "meta_ads" | "google_ads" | "instagram" | "linkedin" | "twitter" | "mailchimp" | "tiktok"
export type PublishingStatus = "draft" | "scheduled" | "publishing" | "live" | "paused" | "failed"

export interface PublishingJob {
  id: string
  deliverableId: string
  projectTitle: string
  channel: PublishingChannel
  status: PublishingStatus
  scheduledAt?: string
  publishedAt?: string
  metrics?: { impressions: number; clicks: number; engagement: number }
}

export interface ChannelConfig {
  channel: PublishingChannel
  label: string
  connected: boolean
  accountName?: string
  lastSync?: string
}

export type BenchmarkTrend = "up" | "down" | "stable"

export interface Benchmark {
  id: string
  category: string
  metric: string
  yourValue: number
  industryAvg: number
  topPerformer: number
  percentile: number
  trend: BenchmarkTrend
  unit: string
}

export type SLAStatus = "on_track" | "at_risk" | "breached"

export interface SLATier {
  tier: PricingTier
  firstDraftHours: number
  finalDeliveryHours: number
  revisionTurnaroundHours: number
  maxRevisions: number
  guaranteedCredits: number
  penaltyPercent: number
}

export interface SLACompliance {
  id: string
  projectId: string
  projectTitle: string
  clientName: string
  tier: PricingTier
  metric: string
  targetHours: number
  actualHours: number
  status: SLAStatus
  creditIssued: number
}

export interface RevenueMetric {
  month: string
  revenue: number
  cost: number
  profit: number
  margin: number
  projects: number
  clients: number
}

export interface CostBreakdown {
  category: string
  amount: number
  percentage: number
  trend: BenchmarkTrend
}
