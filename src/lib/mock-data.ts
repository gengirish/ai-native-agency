import type {
  User, Project, Brief, Deliverable, Review, BrandProfile,
  Invoice, CreditPack, Lead, Pipeline, AITask, AIModel,
  ExpertAssignment, AutonomyConfig, PerformanceMetric,
  ProactiveSuggestion, FeedbackTranslation, PublishingJob,
  ChannelConfig, Benchmark, SLATier, SLACompliance,
  RevenueMetric, CostBreakdown, UsageRecord,
} from "@/types"

export const mockUsers: User[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@agencyos.com", role: "admin", tenantId: "t1", createdAt: "2025-09-01" },
  { id: "u2", name: "Jordan Chen", email: "jordan@agencyos.com", role: "expert", tenantId: "t1", specialty: "Brand Design", createdAt: "2025-10-01" },
  { id: "u3", name: "Sarah Mitchell", email: "sarah@luminabrands.com", role: "client", tenantId: "t2", createdAt: "2025-11-15" },
  { id: "u4", name: "Marcus Webb", email: "marcus@techflow.io", role: "client", tenantId: "t3", createdAt: "2026-01-10" },
  { id: "u5", name: "Priya Sharma", email: "priya@agencyos.com", role: "expert", tenantId: "t1", specialty: "Video & Motion", createdAt: "2025-11-01" },
]

export const mockProjects: Project[] = [
  { id: "p1", title: "Lumina Brand Refresh", type: "brand_identity", status: "delivered", priority: "high", clientId: "u3", clientName: "Lumina Brands", estimatedCost: 8000, actualCost: 7200, aiCost: 3.20, confidenceScore: 0.94, autonomyLevel: "spot_check", qualityScore: 4.7, dueDate: "2026-03-15", createdAt: "2026-02-28", updatedAt: "2026-03-14", deliverableCount: 6, revisionCount: 1 },
  { id: "p2", title: "TechFlow Social Campaign", type: "social_media", status: "expert_review", priority: "medium", clientId: "u4", clientName: "TechFlow", estimatedCost: 3500, actualCost: 2800, aiCost: 1.85, confidenceScore: 0.88, autonomyLevel: "human_required", qualityScore: 4.2, dueDate: "2026-04-10", createdAt: "2026-03-20", updatedAt: "2026-04-04", deliverableCount: 12, revisionCount: 0 },
  { id: "p3", title: "Lumina Holiday Ad Creatives", type: "ad_creative", status: "ai_generating", priority: "urgent", clientId: "u3", clientName: "Lumina Brands", estimatedCost: 5000, actualCost: 0, aiCost: 0, confidenceScore: 0.91, autonomyLevel: "spot_check", qualityScore: 0, dueDate: "2026-04-08", createdAt: "2026-04-02", updatedAt: "2026-04-05", deliverableCount: 0, revisionCount: 0 },
  { id: "p4", title: "TechFlow Product Demo Video", type: "video_ad", status: "client_review", priority: "high", clientId: "u4", clientName: "TechFlow", estimatedCost: 12000, actualCost: 10500, aiCost: 8.40, confidenceScore: 0.72, autonomyLevel: "human_required", qualityScore: 4.5, dueDate: "2026-04-12", createdAt: "2026-03-10", updatedAt: "2026-04-03", deliverableCount: 3, revisionCount: 2 },
  { id: "p5", title: "Lumina Email Nurture Series", type: "email_campaign", status: "approved", priority: "medium", clientId: "u3", clientName: "Lumina Brands", estimatedCost: 2500, actualCost: 2200, aiCost: 0.95, confidenceScore: 0.96, autonomyLevel: "autonomous", qualityScore: 4.8, dueDate: "2026-04-06", createdAt: "2026-03-25", updatedAt: "2026-04-04", deliverableCount: 8, revisionCount: 0 },
  { id: "p6", title: "TechFlow Logo Redesign", type: "logo_design", status: "revision", priority: "high", clientId: "u4", clientName: "TechFlow", estimatedCost: 4000, actualCost: 3600, aiCost: 2.10, confidenceScore: 0.85, autonomyLevel: "human_required", qualityScore: 3.8, dueDate: "2026-04-15", createdAt: "2026-03-28", updatedAt: "2026-04-05", deliverableCount: 4, revisionCount: 1 },
  { id: "p7", title: "Lumina Blog Content Pack", type: "blog_content", status: "delivered", priority: "low", clientId: "u3", clientName: "Lumina Brands", estimatedCost: 1800, actualCost: 1600, aiCost: 0.45, confidenceScore: 0.97, autonomyLevel: "autonomous", qualityScore: 4.6, dueDate: "2026-03-20", createdAt: "2026-03-05", updatedAt: "2026-03-19", deliverableCount: 5, revisionCount: 0 },
  { id: "p8", title: "TechFlow Marketing Collateral", type: "marketing_collateral", status: "submitted", priority: "medium", clientId: "u4", clientName: "TechFlow", estimatedCost: 6000, actualCost: 0, aiCost: 0, confidenceScore: 0.89, autonomyLevel: "spot_check", qualityScore: 0, dueDate: "2026-04-20", createdAt: "2026-04-05", updatedAt: "2026-04-05", deliverableCount: 0, revisionCount: 0 },
]

export const mockBriefs: Brief[] = [
  { id: "b1", projectId: "p1", projectType: "brand_identity", title: "Lumina Brand Refresh", description: "Complete brand identity refresh including new logo variations, color palette update, typography system, and brand guidelines document.", fields: [{ key: "style", label: "Design Style", value: "Modern minimalist with warm tones", type: "text", required: true }, { key: "audience", label: "Target Audience", value: "Millennial professionals, 28-40", type: "text", required: true }], referenceImages: ["/ref/lumina-1.jpg", "/ref/lumina-2.jpg"], targetAudience: "Millennial professionals", tone: "Warm, confident, approachable", deliverables: ["Logo suite", "Color palette", "Typography system", "Brand guidelines PDF"], deadline: "2026-03-15", budget: 8000, submittedAt: "2026-02-28", brandProfileId: "bp1" },
  { id: "b2", projectId: "p2", projectType: "social_media", title: "TechFlow Social Campaign", description: "12-piece social media campaign for product launch across Instagram, LinkedIn, and Twitter.", fields: [{ key: "platforms", label: "Platforms", value: "Instagram, LinkedIn, Twitter", type: "text", required: true }], referenceImages: [], targetAudience: "Tech startup founders", tone: "Bold, innovative, technical", deliverables: ["12 social posts", "3 story templates", "Caption copy"], deadline: "2026-04-10", budget: 3500, submittedAt: "2026-03-20", brandProfileId: "bp2" },
  { id: "b3", projectId: "p3", projectType: "ad_creative", title: "Lumina Holiday Ads", description: "Spring holiday ad creatives for Meta and Google display network.", fields: [], referenceImages: [], targetAudience: "Existing customers", tone: "Festive, premium", deliverables: ["6 display ads", "2 video ads"], deadline: "2026-04-08", budget: 5000, submittedAt: "2026-04-02", brandProfileId: "bp1" },
  { id: "b4", projectId: "p8", projectType: "marketing_collateral", title: "TechFlow Marketing Kit", description: "Complete marketing collateral package: pitch deck, one-pager, case study template.", fields: [], referenceImages: [], targetAudience: "Enterprise buyers", tone: "Professional, data-driven", deliverables: ["Pitch deck", "One-pager", "Case study template"], deadline: "2026-04-20", budget: 6000, submittedAt: "2026-04-05", brandProfileId: "bp2" },
]

export const mockDeliverables: Deliverable[] = [
  { id: "d1", projectId: "p1", version: 2, title: "Primary Logo — Final", type: "image/svg+xml", fileUrl: "/assets/lumina-logo-v2.svg", thumbnailUrl: "/thumbs/lumina-logo.png", status: "approved", aiModel: "Midjourney v6", generationCost: 0.45, generationTime: 32, qualityScore: 4.8, createdAt: "2026-03-08" },
  { id: "d2", projectId: "p1", version: 1, title: "Color Palette", type: "image/png", fileUrl: "/assets/lumina-palette.png", thumbnailUrl: "/thumbs/lumina-palette.png", status: "approved", aiModel: "GPT-4o", generationCost: 0.12, generationTime: 8, qualityScore: 4.9, createdAt: "2026-03-06" },
  { id: "d3", projectId: "p2", version: 1, title: "Instagram Post Set (6)", type: "image/png", fileUrl: "/assets/tf-instagram.zip", thumbnailUrl: "/thumbs/tf-ig-preview.png", status: "review", aiModel: "Flux Pro", generationCost: 0.85, generationTime: 45, qualityScore: 4.3, createdAt: "2026-04-03" },
  { id: "d4", projectId: "p4", version: 2, title: "Product Demo — 60s Cut", type: "video/mp4", fileUrl: "/assets/tf-demo-v2.mp4", thumbnailUrl: "/thumbs/tf-demo.png", status: "review", aiModel: "Runway Gen-3", generationCost: 4.20, generationTime: 180, qualityScore: 4.5, createdAt: "2026-04-02" },
  { id: "d5", projectId: "p5", version: 1, title: "Welcome Email", type: "text/html", fileUrl: "/assets/lumina-welcome.html", thumbnailUrl: "/thumbs/lumina-email.png", status: "approved", aiModel: "Claude 3.5", generationCost: 0.08, generationTime: 5, qualityScore: 4.9, createdAt: "2026-04-01" },
  { id: "d6", projectId: "p6", version: 1, title: "Logo Concept A", type: "image/svg+xml", fileUrl: "/assets/tf-logo-a.svg", thumbnailUrl: "/thumbs/tf-logo-a.png", status: "revision", aiModel: "Midjourney v6", generationCost: 0.45, generationTime: 28, qualityScore: 3.6, createdAt: "2026-04-01" },
]

export const mockReviews: Review[] = [
  { id: "r1", deliverableId: "d1", projectId: "p1", reviewerId: "u2", reviewerName: "Jordan Chen", reviewerRole: "expert", status: "approved", rating: 5, comments: [{ id: "c1", author: "Jordan Chen", authorRole: "expert", content: "Excellent execution. The negative space in the mark is clever and on-brand.", createdAt: "2026-03-09" }], timeSpent: 8, createdAt: "2026-03-09" },
  { id: "r2", deliverableId: "d3", projectId: "p2", reviewerId: "u2", reviewerName: "Jordan Chen", reviewerRole: "expert", status: "pending", rating: 0, comments: [], timeSpent: 0, createdAt: "2026-04-04" },
  { id: "r3", deliverableId: "d4", projectId: "p4", reviewerId: "u5", reviewerName: "Priya Sharma", reviewerRole: "expert", status: "pending", rating: 0, comments: [], timeSpent: 0, createdAt: "2026-04-03" },
  { id: "r4", deliverableId: "d6", projectId: "p6", reviewerId: "u2", reviewerName: "Jordan Chen", reviewerRole: "expert", status: "revision_requested", rating: 3, comments: [{ id: "c2", author: "Jordan Chen", authorRole: "expert", content: "The icon weight doesn't match the wordmark. Needs balancing.", createdAt: "2026-04-03" }, { id: "c3", author: "Marcus Webb", authorRole: "client", content: "I want it to feel more premium — less startup-y", createdAt: "2026-04-04" }], timeSpent: 12, createdAt: "2026-04-03" },
]

export const mockBrandProfiles: BrandProfile[] = [
  { id: "bp1", tenantId: "t2", name: "Lumina Brands", websiteUrl: "https://luminabrands.com", logoUrl: "/brands/lumina-logo.svg", colors: [{ name: "Lumina Gold", hex: "#D4A574", usage: "primary" }, { name: "Deep Navy", hex: "#1A2332", usage: "secondary" }, { name: "Warm White", hex: "#FAF7F2", usage: "neutral" }, { name: "Coral Accent", hex: "#E8836B", usage: "accent" }], fonts: [{ name: "Playfair Display", usage: "heading", weight: "700" }, { name: "Inter", usage: "body", weight: "400" }], toneOfVoice: "Warm, sophisticated, confident. Speaks like a trusted advisor, not a salesperson.", values: ["Authenticity", "Craftsmanship", "Sustainability"], targetAudience: "Millennial professionals, 28-40, urban, high disposable income", industry: "Lifestyle & Luxury", competitors: ["Aesop", "Glossier", "Byredo"], assets: [{ id: "a1", type: "logo", url: "/brands/lumina-logo.svg", name: "Primary Logo", tags: ["logo", "primary"] }, { id: "a2", type: "pattern", url: "/brands/lumina-pattern.png", name: "Brand Pattern", tags: ["pattern", "texture"] }], dnaScore: 94, projectsCompleted: 12, lastUpdated: "2026-04-01" },
  { id: "bp2", tenantId: "t3", name: "TechFlow", websiteUrl: "https://techflow.io", logoUrl: "/brands/techflow-logo.svg", colors: [{ name: "Electric Blue", hex: "#3B82F6", usage: "primary" }, { name: "Midnight", hex: "#0F172A", usage: "secondary" }, { name: "Neon Green", hex: "#22D3EE", usage: "accent" }, { name: "Slate", hex: "#94A3B8", usage: "neutral" }], fonts: [{ name: "Space Grotesk", usage: "heading", weight: "600" }, { name: "IBM Plex Mono", usage: "accent", weight: "400" }, { name: "Inter", usage: "body", weight: "400" }], toneOfVoice: "Bold, technical, forward-thinking. Like a smart engineer explaining something complex simply.", values: ["Innovation", "Speed", "Transparency"], targetAudience: "Tech startup founders and CTOs, 25-45", industry: "B2B SaaS", competitors: ["Linear", "Vercel", "Supabase"], assets: [{ id: "a3", type: "logo", url: "/brands/tf-logo.svg", name: "TechFlow Logo", tags: ["logo", "primary"] }], dnaScore: 87, projectsCompleted: 5, lastUpdated: "2026-03-28" },
]

export const mockInvoices: Invoice[] = [
  { id: "inv1", tenantId: "t2", clientName: "Lumina Brands", amount: 7200, status: "paid", items: [{ description: "Brand Identity Refresh", quantity: 1, unitPrice: 7200, total: 7200 }], createdAt: "2026-03-15", dueDate: "2026-03-30", paidAt: "2026-03-22" },
  { id: "inv2", tenantId: "t3", clientName: "TechFlow", amount: 10500, status: "sent", items: [{ description: "Product Demo Video", quantity: 1, unitPrice: 10500, total: 10500 }], createdAt: "2026-04-03", dueDate: "2026-04-17" },
  { id: "inv3", tenantId: "t2", clientName: "Lumina Brands", amount: 2200, status: "paid", items: [{ description: "Email Nurture Series (8 emails)", quantity: 8, unitPrice: 275, total: 2200 }], createdAt: "2026-04-04", dueDate: "2026-04-18", paidAt: "2026-04-05" },
  { id: "inv4", tenantId: "t3", clientName: "TechFlow", amount: 3500, status: "draft", items: [{ description: "Social Media Campaign (12 posts)", quantity: 12, unitPrice: 292, total: 3500 }], createdAt: "2026-04-05", dueDate: "2026-04-19" },
  { id: "inv5", tenantId: "t2", clientName: "Lumina Brands", amount: 5000, status: "overdue", items: [{ description: "Holiday Ad Creatives", quantity: 1, unitPrice: 5000, total: 5000 }], createdAt: "2026-03-01", dueDate: "2026-03-15" },
]

export const mockCreditPacks: CreditPack[] = [
  { id: "cp1", name: "Starter", credits: 5, price: 2500, pricePerCredit: 500, popular: false, features: ["5 projects", "48h turnaround", "Email support", "1 revision per project"] },
  { id: "cp2", name: "Growth", credits: 15, price: 6000, pricePerCredit: 400, popular: true, features: ["15 projects", "24h turnaround", "Priority support", "3 revisions per project", "Brand profile setup"] },
  { id: "cp3", name: "Scale", credits: 50, price: 15000, pricePerCredit: 300, popular: false, features: ["50 projects", "4h turnaround", "Dedicated expert", "Unlimited revisions", "Brand DNA extraction", "Performance analytics"] },
]

export const mockLeads: Lead[] = [
  { id: "l1", company: "Meridian Labs", contactName: "Elena Vasquez", email: "elena@meridianlabs.co", status: "demo_scheduled", value: 24000, source: "Inbound — Website", notes: "Interested in full brand identity + ongoing social management. Currently using freelancers.", createdAt: "2026-03-28", lastContactAt: "2026-04-03", nextFollowUp: "2026-04-07", speculativeWorkUrl: "/demos/meridian-preview.pdf" },
  { id: "l2", company: "Nova Fitness", contactName: "Jake Torres", email: "jake@novafitness.com", phone: "+1-555-0142", status: "proposal_sent", value: 18000, source: "Referral — Lumina Brands", notes: "Need social + video content for app launch. Budget flexible if quality is there.", createdAt: "2026-03-15", lastContactAt: "2026-04-01", nextFollowUp: "2026-04-06" },
  { id: "l3", company: "Arcadia Finance", contactName: "Diana Park", email: "diana@arcadiafinance.com", status: "new", value: 36000, source: "Outbound — LinkedIn", notes: "Enterprise fintech, needs compliance-safe marketing materials + brand guidelines.", createdAt: "2026-04-04", lastContactAt: "2026-04-04" },
  { id: "l4", company: "Greenline Organics", contactName: "Tom Nakamura", email: "tom@greenlineorganics.com", status: "won", value: 9600, source: "Inbound — Speculative Work", notes: "Converted after seeing AI-generated sample packaging concepts.", createdAt: "2026-02-10", lastContactAt: "2026-03-01" },
  { id: "l5", company: "Pulse Media", contactName: "Chloe Adeyemi", email: "chloe@pulsemedia.io", status: "lost", value: 15000, source: "Inbound — Website", notes: "Went with incumbent agency. Said our pricing was competitive but wanted in-person meetings.", createdAt: "2026-01-20", lastContactAt: "2026-02-15" },
]

export const mockAIModels: AIModel[] = [
  { id: "m1", provider: "openai", name: "GPT-4o", capabilities: ["copywriting", "strategy", "code", "analysis"], costPer1kTokens: 0.005, avgLatencyMs: 1200, qualityScore: 4.6, isActive: true },
  { id: "m2", provider: "anthropic", name: "Claude 3.5 Sonnet", capabilities: ["copywriting", "legal", "analysis", "long-form"], costPer1kTokens: 0.003, avgLatencyMs: 800, qualityScore: 4.8, isActive: true },
  { id: "m3", provider: "midjourney", name: "Midjourney v6", capabilities: ["logo", "illustration", "brand_asset", "concept_art"], costPer1kTokens: 0.02, avgLatencyMs: 28000, qualityScore: 4.7, isActive: true },
  { id: "m4", provider: "flux", name: "Flux Pro", capabilities: ["social_media", "photography", "product_shot", "ad_creative"], costPer1kTokens: 0.01, avgLatencyMs: 15000, qualityScore: 4.4, isActive: true },
  { id: "m5", provider: "runway", name: "Runway Gen-3 Alpha", capabilities: ["video", "animation", "motion_graphics"], costPer1kTokens: 0.05, avgLatencyMs: 120000, qualityScore: 4.3, isActive: true },
  { id: "m6", provider: "elevenlabs", name: "ElevenLabs v2", capabilities: ["voiceover", "narration", "podcast"], costPer1kTokens: 0.015, avgLatencyMs: 3000, qualityScore: 4.5, isActive: true },
]

export const mockPipelines: Pipeline[] = [
  { id: "pl1", projectId: "p3", projectTitle: "Lumina Holiday Ad Creatives", status: "running", totalCost: 1.20, totalTime: 45, startedAt: "2026-04-05T10:30:00Z", tasks: [
    { id: "t1", pipelineId: "pl1", type: "brief_analysis", modelId: "m1", modelName: "GPT-4o", status: "completed", input: "Analyze brief for holiday ad creatives", cost: 0.02, latencyMs: 1500, retryCount: 0, createdAt: "2026-04-05T10:30:00Z", completedAt: "2026-04-05T10:30:02Z" },
    { id: "t2", pipelineId: "pl1", type: "copy_generation", modelId: "m2", modelName: "Claude 3.5", status: "completed", input: "Generate ad copy variants", cost: 0.03, latencyMs: 2200, retryCount: 0, createdAt: "2026-04-05T10:30:02Z", completedAt: "2026-04-05T10:30:04Z" },
    { id: "t3", pipelineId: "pl1", type: "image_generation", modelId: "m4", modelName: "Flux Pro", status: "running", input: "Generate 6 display ad images", cost: 0.85, latencyMs: 0, retryCount: 0, createdAt: "2026-04-05T10:30:04Z" },
    { id: "t4", pipelineId: "pl1", type: "video_generation", modelId: "m5", modelName: "Runway Gen-3", status: "queued", input: "Generate 2 video ads (15s each)", cost: 0, latencyMs: 0, retryCount: 0, createdAt: "2026-04-05T10:30:04Z" },
    { id: "t5", pipelineId: "pl1", type: "qa_validation", modelId: "m1", modelName: "GPT-4o", status: "queued", input: "Validate brand consistency and quality", cost: 0, latencyMs: 0, retryCount: 0, createdAt: "2026-04-05T10:30:04Z" },
  ]},
  { id: "pl2", projectId: "p5", projectTitle: "Lumina Email Nurture Series", status: "completed", totalCost: 0.95, totalTime: 180, startedAt: "2026-03-26T09:00:00Z", completedAt: "2026-03-26T09:03:00Z", tasks: [
    { id: "t6", pipelineId: "pl2", type: "brief_analysis", modelId: "m2", modelName: "Claude 3.5", status: "completed", input: "Analyze email campaign brief", cost: 0.02, latencyMs: 900, retryCount: 0, createdAt: "2026-03-26T09:00:00Z", completedAt: "2026-03-26T09:00:01Z" },
    { id: "t7", pipelineId: "pl2", type: "copy_generation", modelId: "m2", modelName: "Claude 3.5", status: "completed", input: "Generate 8-email nurture sequence", cost: 0.35, latencyMs: 12000, retryCount: 0, createdAt: "2026-03-26T09:00:01Z", completedAt: "2026-03-26T09:00:13Z" },
    { id: "t8", pipelineId: "pl2", type: "design_generation", modelId: "m4", modelName: "Flux Pro", status: "completed", input: "Generate email header images", cost: 0.50, latencyMs: 90000, retryCount: 0, createdAt: "2026-03-26T09:00:13Z", completedAt: "2026-03-26T09:01:43Z" },
    { id: "t9", pipelineId: "pl2", type: "qa_validation", modelId: "m1", modelName: "GPT-4o", status: "completed", input: "Validate email content and design", cost: 0.08, latencyMs: 3000, retryCount: 0, createdAt: "2026-03-26T09:01:43Z", completedAt: "2026-03-26T09:01:46Z" },
  ]},
]

export const mockExpertAssignments: ExpertAssignment[] = [
  { id: "ea1", projectId: "p2", projectTitle: "TechFlow Social Campaign", projectType: "social_media", expertId: "u2", expertName: "Jordan Chen", status: "in_review", escalationLevel: "standard", priority: "medium", claimedAt: "2026-04-04T14:00:00Z", reviewTimeMinutes: 0, qualityBefore: 4.2, qualityAfter: 0 },
  { id: "ea2", projectId: "p4", projectTitle: "TechFlow Product Demo Video", projectType: "video_ad", expertId: "u5", expertName: "Priya Sharma", status: "completed", escalationLevel: "senior", priority: "high", claimedAt: "2026-04-02T10:00:00Z", completedAt: "2026-04-02T10:25:00Z", reviewTimeMinutes: 25, qualityBefore: 3.9, qualityAfter: 4.5 },
  { id: "ea3", projectId: "p6", projectTitle: "TechFlow Logo Redesign", projectType: "logo_design", expertId: "u2", expertName: "Jordan Chen", status: "queued", escalationLevel: "standard", priority: "high", reviewTimeMinutes: 0, qualityBefore: 3.6, qualityAfter: 0 },
  { id: "ea4", projectId: "p1", projectTitle: "Lumina Brand Refresh", projectType: "brand_identity", expertId: "u2", expertName: "Jordan Chen", status: "completed", escalationLevel: "standard", priority: "high", claimedAt: "2026-03-10T09:00:00Z", completedAt: "2026-03-10T09:12:00Z", reviewTimeMinutes: 12, qualityBefore: 4.3, qualityAfter: 4.7 },
  { id: "ea5", projectId: "p5", projectTitle: "Lumina Email Nurture Series", projectType: "email_campaign", expertId: "u2", expertName: "Jordan Chen", status: "completed", escalationLevel: "standard", priority: "medium", claimedAt: "2026-04-01T11:00:00Z", completedAt: "2026-04-01T11:08:00Z", reviewTimeMinutes: 8, qualityBefore: 4.6, qualityAfter: 4.8 },
]

export const mockAutonomyConfigs: AutonomyConfig[] = [
  { id: "ac1", taskType: "email_campaign", taskLabel: "Email Campaigns", currentLevel: "autonomous", confidenceScore: 0.96, totalCompleted: 34, successRate: 0.97, revisionRate: 0.03, avgQualityScore: 4.7, trend: "stable", projectedAutonomyDate: "2026-02-15" },
  { id: "ac2", taskType: "blog_content", taskLabel: "Blog Content", currentLevel: "autonomous", confidenceScore: 0.95, totalCompleted: 28, successRate: 0.96, revisionRate: 0.04, avgQualityScore: 4.6, trend: "improving" },
  { id: "ac3", taskType: "social_media", taskLabel: "Social Media Posts", currentLevel: "spot_check", confidenceScore: 0.88, totalCompleted: 156, successRate: 0.91, revisionRate: 0.09, avgQualityScore: 4.3, trend: "improving", projectedAutonomyDate: "2026-06-01" },
  { id: "ac4", taskType: "logo_design", taskLabel: "Logo Design", currentLevel: "human_required", confidenceScore: 0.72, totalCompleted: 18, successRate: 0.78, revisionRate: 0.28, avgQualityScore: 3.9, trend: "improving", projectedAutonomyDate: "2026-12-01" },
  { id: "ac5", taskType: "video_ad", taskLabel: "Video Ads", currentLevel: "human_required", confidenceScore: 0.65, totalCompleted: 8, successRate: 0.75, revisionRate: 0.38, avgQualityScore: 3.7, trend: "improving", projectedAutonomyDate: "2027-03-01" },
  { id: "ac6", taskType: "brand_identity", taskLabel: "Brand Identity", currentLevel: "human_required", confidenceScore: 0.70, totalCompleted: 12, successRate: 0.83, revisionRate: 0.25, avgQualityScore: 4.0, trend: "stable", projectedAutonomyDate: "2027-01-01" },
  { id: "ac7", taskType: "ad_creative", taskLabel: "Ad Creatives", currentLevel: "spot_check", confidenceScore: 0.85, totalCompleted: 45, successRate: 0.89, revisionRate: 0.11, avgQualityScore: 4.2, trend: "improving", projectedAutonomyDate: "2026-07-01" },
  { id: "ac8", taskType: "marketing_collateral", taskLabel: "Marketing Collateral", currentLevel: "spot_check", confidenceScore: 0.82, totalCompleted: 22, successRate: 0.86, revisionRate: 0.14, avgQualityScore: 4.1, trend: "stable", projectedAutonomyDate: "2026-08-01" },
]

export const mockPerformanceMetrics: PerformanceMetric[] = [
  { id: "pm1", deliverableId: "d1", projectTitle: "Lumina Brand Refresh", channel: "instagram", impressions: 45200, clicks: 3180, ctr: 0.0703, conversions: 128, spend: 850, roi: 4.2, measuredAt: "2026-04-03" },
  { id: "pm2", deliverableId: "d3", projectTitle: "TechFlow Social Campaign", channel: "linkedin", impressions: 18400, clicks: 920, ctr: 0.05, conversions: 45, spend: 620, roi: 3.1, measuredAt: "2026-04-04" },
  { id: "pm3", deliverableId: "d5", projectTitle: "Lumina Email Nurture Series", channel: "mailchimp", impressions: 8500, clicks: 2125, ctr: 0.25, conversions: 340, spend: 0, roi: 12.8, measuredAt: "2026-04-04" },
  { id: "pm4", deliverableId: "d4", projectTitle: "TechFlow Product Demo", channel: "meta_ads", impressions: 125000, clicks: 6250, ctr: 0.05, conversions: 312, spend: 3200, roi: 5.6, measuredAt: "2026-04-05" },
  { id: "pm5", deliverableId: "d1", projectTitle: "Lumina Brand Refresh", channel: "meta_ads", impressions: 89000, clicks: 5340, ctr: 0.06, conversions: 267, spend: 2100, roi: 6.3, measuredAt: "2026-04-05" },
]

export const mockSuggestions: ProactiveSuggestion[] = [
  { id: "s1", tenantId: "t2", clientName: "Lumina Brands", type: "social_media", title: "Earth Day Campaign", description: "Earth Day is April 22. Your competitor Byredo just launched a sustainability campaign. We've pre-generated 6 Instagram posts highlighting your sustainability values.", reasoning: "Seasonal trend + competitor activity + brand value alignment", trendSource: "Instagram Trends + Competitor Watch", relevanceScore: 0.94, estimatedValue: 3500, status: "pending", createdAt: "2026-04-05", expiresAt: "2026-04-20" },
  { id: "s2", tenantId: "t3", clientName: "TechFlow", type: "blog_content", title: "AI in DevOps Thought Leadership", description: "Search volume for 'AI DevOps' up 340% this quarter. We've drafted 3 blog posts positioning TechFlow as a thought leader in AI-powered developer tools.", reasoning: "Rising search trend in client's industry", trendSource: "Google Trends + Industry Reports", relevanceScore: 0.87, estimatedValue: 2400, status: "generated", createdAt: "2026-04-04", expiresAt: "2026-04-18" },
  { id: "s3", tenantId: "t2", clientName: "Lumina Brands", type: "email_campaign", title: "Spring Collection Preview", description: "Based on your product calendar, the spring collection launches May 1. Here's a 4-email teaser sequence ready for review.", reasoning: "Product calendar alignment", trendSource: "Client Product Calendar", relevanceScore: 0.92, estimatedValue: 2800, status: "accepted", createdAt: "2026-04-03", expiresAt: "2026-04-25" },
  { id: "s4", tenantId: "t3", clientName: "TechFlow", type: "ad_creative", title: "Product Hunt Launch Assets", description: "We noticed TechFlow v2.0 is scheduled for release. Here are Product Hunt-optimized graphics, taglines, and a launch day social kit.", reasoning: "Product release detection + channel optimization", trendSource: "Product Roadmap Integration", relevanceScore: 0.91, estimatedValue: 4200, status: "pending", createdAt: "2026-04-05", expiresAt: "2026-04-15" },
]

export const mockFeedbackTranslations: FeedbackTranslation[] = [
  { id: "ft1", original: "I want it to feel more premium and less startup-y", translated: "Increase whitespace by 25%. Switch heading font from geometric sans-serif to a refined serif (suggest: Playfair Display). Reduce color palette to 2 primary colors. Add subtle drop shadows to CTAs. Use larger type sizes.", confidence: 0.89, actionableItems: [{ action: "increase", parameter: "whitespace", value: "+25%", priority: "high" }, { action: "change", parameter: "heading_font", value: "serif family", priority: "high" }, { action: "reduce", parameter: "color_count", value: "2 primary", priority: "medium" }, { action: "add", parameter: "cta_shadow", value: "subtle drop shadow", priority: "low" }], category: "aesthetic" },
  { id: "ft2", original: "Make it pop more", translated: "Increase contrast ratio between foreground and background. Boost saturation of accent color by 15-20%. Increase CTA button size by 20%. Add micro-animation on hover states.", confidence: 0.82, actionableItems: [{ action: "increase", parameter: "contrast_ratio", value: "+30%", priority: "high" }, { action: "increase", parameter: "accent_saturation", value: "+15%", priority: "medium" }, { action: "increase", parameter: "cta_size", value: "+20%", priority: "medium" }, { action: "add", parameter: "hover_animation", value: "micro-interaction", priority: "low" }], category: "aesthetic" },
  { id: "ft3", original: "The tone is too corporate, we're a fun brand", translated: "Replace formal language with conversational copy. Use contractions. Add 1-2 relevant colloquialisms per section. Switch from passive to active voice. Consider emoji in social-facing copy.", confidence: 0.91, actionableItems: [{ action: "rewrite", parameter: "copy_tone", value: "conversational", priority: "high" }, { action: "add", parameter: "contractions", value: "throughout", priority: "medium" }, { action: "switch", parameter: "voice", value: "active", priority: "high" }], category: "content" },
]

export const mockPublishingJobs: PublishingJob[] = [
  { id: "pj1", deliverableId: "d1", projectTitle: "Lumina Brand Refresh", channel: "instagram", status: "live", publishedAt: "2026-03-20T10:00:00Z", metrics: { impressions: 45200, clicks: 3180, engagement: 0.082 } },
  { id: "pj2", deliverableId: "d5", projectTitle: "Lumina Email Nurture", channel: "mailchimp", status: "live", publishedAt: "2026-04-01T08:00:00Z", metrics: { impressions: 8500, clicks: 2125, engagement: 0.25 } },
  { id: "pj3", deliverableId: "d3", projectTitle: "TechFlow Social", channel: "linkedin", status: "scheduled", scheduledAt: "2026-04-10T14:00:00Z" },
  { id: "pj4", deliverableId: "d4", projectTitle: "TechFlow Demo Video", channel: "meta_ads", status: "draft" },
  { id: "pj5", deliverableId: "d1", projectTitle: "Lumina Brand Refresh", channel: "meta_ads", status: "live", publishedAt: "2026-03-22T12:00:00Z", metrics: { impressions: 89000, clicks: 5340, engagement: 0.06 } },
]

export const mockChannelConfigs: ChannelConfig[] = [
  { channel: "instagram", label: "Instagram", connected: true, accountName: "@agencyos_official", lastSync: "2026-04-05T08:00:00Z" },
  { channel: "meta_ads", label: "Meta Ads", connected: true, accountName: "AgencyOS Business", lastSync: "2026-04-05T08:00:00Z" },
  { channel: "linkedin", label: "LinkedIn", connected: true, accountName: "AgencyOS Inc.", lastSync: "2026-04-04T22:00:00Z" },
  { channel: "google_ads", label: "Google Ads", connected: true, accountName: "AgencyOS — 847-291-0033", lastSync: "2026-04-05T06:00:00Z" },
  { channel: "mailchimp", label: "Mailchimp", connected: true, accountName: "agencyos@email.com", lastSync: "2026-04-05T07:30:00Z" },
  { channel: "twitter", label: "X (Twitter)", connected: false },
  { channel: "tiktok", label: "TikTok", connected: false },
]

export const mockBenchmarks: Benchmark[] = [
  { id: "bm1", category: "Speed", metric: "Brief-to-First-Draft", yourValue: 12, industryAvg: 72, topPerformer: 8, percentile: 92, trend: "up", unit: "minutes" },
  { id: "bm2", category: "Speed", metric: "Total Project Turnaround", yourValue: 4.2, industryAvg: 168, topPerformer: 2, percentile: 97, trend: "up", unit: "hours" },
  { id: "bm3", category: "Cost", metric: "Cost per Project", yourValue: 1050, industryAvg: 7200, topPerformer: 800, percentile: 88, trend: "up", unit: "USD" },
  { id: "bm4", category: "Cost", metric: "Gross Margin", yourValue: 89.5, industryAvg: 35, topPerformer: 92, percentile: 95, trend: "stable", unit: "%" },
  { id: "bm5", category: "Quality", metric: "Client Satisfaction (NPS)", yourValue: 72, industryAvg: 42, topPerformer: 85, percentile: 82, trend: "up", unit: "score" },
  { id: "bm6", category: "Quality", metric: "First-Pass Approval Rate", yourValue: 78, industryAvg: 45, topPerformer: 88, percentile: 80, trend: "up", unit: "%" },
  { id: "bm7", category: "Scale", metric: "Projects per Expert per Month", yourValue: 42, industryAvg: 6, topPerformer: 50, percentile: 90, trend: "up", unit: "projects" },
  { id: "bm8", category: "Scale", metric: "Revenue per Employee", yourValue: 45000, industryAvg: 12000, topPerformer: 55000, percentile: 88, trend: "up", unit: "USD/mo" },
]

export const mockSLATiers: SLATier[] = [
  { tier: "starter", firstDraftHours: 48, finalDeliveryHours: 120, revisionTurnaroundHours: 48, maxRevisions: 1, guaranteedCredits: 0, penaltyPercent: 0 },
  { tier: "professional", firstDraftHours: 24, finalDeliveryHours: 72, revisionTurnaroundHours: 24, maxRevisions: 3, guaranteedCredits: 1, penaltyPercent: 10 },
  { tier: "enterprise", firstDraftHours: 4, finalDeliveryHours: 24, revisionTurnaroundHours: 4, maxRevisions: -1, guaranteedCredits: 3, penaltyPercent: 25 },
]

export const mockSLACompliance: SLACompliance[] = [
  { id: "sla1", projectId: "p1", projectTitle: "Lumina Brand Refresh", clientName: "Lumina Brands", tier: "professional", metric: "First Draft", targetHours: 24, actualHours: 18, status: "on_track", creditIssued: 0 },
  { id: "sla2", projectId: "p2", projectTitle: "TechFlow Social Campaign", clientName: "TechFlow", tier: "professional", metric: "First Draft", targetHours: 24, actualHours: 22, status: "on_track", creditIssued: 0 },
  { id: "sla3", projectId: "p3", projectTitle: "Lumina Holiday Ads", clientName: "Lumina Brands", tier: "enterprise", metric: "First Draft", targetHours: 4, actualHours: 3.5, status: "on_track", creditIssued: 0 },
  { id: "sla4", projectId: "p4", projectTitle: "TechFlow Product Demo", clientName: "TechFlow", tier: "enterprise", metric: "Final Delivery", targetHours: 24, actualHours: 20, status: "at_risk", creditIssued: 0 },
  { id: "sla5", projectId: "p6", projectTitle: "TechFlow Logo Redesign", clientName: "TechFlow", tier: "professional", metric: "Revision Turnaround", targetHours: 24, actualHours: 28, status: "breached", creditIssued: 1 },
]

export const mockRevenueMetrics: RevenueMetric[] = [
  { month: "2025-10", revenue: 8400, cost: 2800, profit: 5600, margin: 0.667, projects: 3, clients: 1 },
  { month: "2025-11", revenue: 14200, cost: 3100, profit: 11100, margin: 0.782, projects: 5, clients: 2 },
  { month: "2025-12", revenue: 22800, cost: 3600, profit: 19200, margin: 0.842, projects: 8, clients: 3 },
  { month: "2026-01", revenue: 31500, cost: 4200, profit: 27300, margin: 0.867, projects: 12, clients: 4 },
  { month: "2026-02", revenue: 42000, cost: 4800, profit: 37200, margin: 0.886, projects: 16, clients: 5 },
  { month: "2026-03", revenue: 58500, cost: 5500, profit: 53000, margin: 0.906, projects: 22, clients: 7 },
]

export const mockCostBreakdown: CostBreakdown[] = [
  { category: "AI Compute (LLM)", amount: 1200, percentage: 22, trend: "down" },
  { category: "AI Compute (Image)", amount: 1800, percentage: 33, trend: "down" },
  { category: "AI Compute (Video)", amount: 800, percentage: 15, trend: "stable" },
  { category: "Expert Review", amount: 1200, percentage: 22, trend: "down" },
  { category: "Infrastructure", amount: 500, percentage: 8, trend: "stable" },
]

export const mockUsageRecords: UsageRecord[] = [
  { tenantId: "t2", month: "2026-03", projectsCompleted: 8, creditsUsed: 8, creditsRemaining: 7, totalSpend: 24000, aiCost: 12.40, margin: 0.9995 },
  { tenantId: "t3", month: "2026-03", projectsCompleted: 5, creditsUsed: 5, creditsRemaining: 10, totalSpend: 18000, aiCost: 8.20, margin: 0.9995 },
]

export const dashboardStats = {
  totalRevenue: 177400,
  monthlyRevenue: 58500,
  revenueGrowth: 0.393,
  activeProjects: 4,
  totalProjects: 52,
  avgMargin: 0.895,
  avgQualityScore: 4.4,
  avgTurnaround: 4.2,
  totalClients: 7,
  activeClients: 5,
  pipelineValue: 93000,
  expertUtilization: 0.78,
  autonomousRate: 0.35,
  aiCostPerProject: 2.85,
}
