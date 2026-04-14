/**
 * Data Access Layer — dual mode.
 *
 * When DATABASE_URL is set  → queries Neon Postgres.
 * When DATABASE_URL is unset → falls back to the in-memory demo store.
 *
 * Every API route should import from here instead of `store` directly.
 */

import { getDb, hasDb } from "./db"
import { store, uid } from "./store"
import type {
  AIModel,
  AutonomyConfig,
  Benchmark,
  BrandProfile,
  ChannelConfig,
  CostBreakdown,
  CreditPack,
  Deliverable,
  ExpertAssignment,
  FeedbackTranslation,
  Invoice,
  Lead,
  PerformanceMetric,
  Pipeline,
  ProactiveSuggestion,
  Project,
  PublishingJob,
  RevenueMetric,
  Review,
  ReviewComment,
  SLACompliance,
  SLATier,
  UsageRecord,
  UserRole,
} from "@/types"

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function toCamel(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    out[camel] = v
  }
  return out
}

function rowsTo<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => toCamel(r) as T)
}

/* ------------------------------------------------------------------ */
/*  Users                                                             */
/* ------------------------------------------------------------------ */

export interface DbUser {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId: string
  specialty?: string
  passwordHash?: string
  createdAt: string
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT id, name, email, role, tenant_id, specialties[1] as specialty,
             password_hash, created_at
      FROM users WHERE email = ${email} LIMIT 1
    `
    if (!rows.length) return null
    const r = rows[0]
    return {
      id: String(r.id),
      name: String(r.name),
      email: String(r.email),
      role: String(r.role) as UserRole,
      tenantId: String(r.tenant_id),
      specialty: r.specialty ? String(r.specialty) : undefined,
      passwordHash: r.password_hash ? String(r.password_hash) : undefined,
      createdAt: String(r.created_at),
    }
  }
  const u = store.users.find((u) => u.email === email)
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    tenantId: u.tenantId,
    specialty: u.specialty,
    passwordHash: u.password,
    createdAt: u.createdAt,
  }
}

export async function findUserById(id: string): Promise<DbUser | null> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT id, name, email, role, tenant_id, specialties[1] as specialty,
             password_hash, created_at
      FROM users WHERE id = ${id}::uuid LIMIT 1
    `
    if (!rows.length) return null
    const r = rows[0]
    return {
      id: String(r.id),
      name: String(r.name),
      email: String(r.email),
      role: String(r.role) as UserRole,
      tenantId: String(r.tenant_id),
      specialty: r.specialty ? String(r.specialty) : undefined,
      passwordHash: r.password_hash ? String(r.password_hash) : undefined,
      createdAt: String(r.created_at),
    }
  }
  const u = store.users.find((u) => u.id === id)
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    tenantId: u.tenantId,
    specialty: u.specialty,
    passwordHash: u.password,
    createdAt: u.createdAt,
  }
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  tenantId: string
  specialty?: string
  passwordHash: string
}

export async function createUser(input: CreateUserInput): Promise<DbUser> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      INSERT INTO users (tenant_id, email, name, role, password_hash, specialties)
      VALUES (${input.tenantId}::uuid, ${input.email}, ${input.name}, ${input.role},
              ${input.passwordHash}, ${input.specialty ? [input.specialty] : []})
      RETURNING id, name, email, role, tenant_id, specialties[1] as specialty, created_at
    `
    const r = rows[0]
    return {
      id: String(r.id),
      name: String(r.name),
      email: String(r.email),
      role: String(r.role) as UserRole,
      tenantId: String(r.tenant_id),
      specialty: r.specialty ? String(r.specialty) : undefined,
      createdAt: String(r.created_at),
    }
  }
  const id = uid("u")
  const user = {
    id,
    name: input.name,
    email: input.email,
    password: input.passwordHash,
    role: input.role,
    tenantId: input.tenantId,
    specialty: input.specialty,
    createdAt: new Date().toISOString(),
  }
  store.users.push(user)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    specialty: user.specialty,
    createdAt: user.createdAt,
  }
}

/* ------------------------------------------------------------------ */
/*  Projects                                                          */
/* ------------------------------------------------------------------ */

export async function getProjects(tenantId?: string): Promise<Project[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = tenantId
      ? await sql`
          SELECT p.*, t.name as client_name,
            (SELECT count(*) FROM deliverables d WHERE d.project_id = p.id) as deliverable_count
          FROM projects p
          JOIN tenants t ON t.id = p.tenant_id
          WHERE p.tenant_id = ${tenantId}::uuid
          ORDER BY p.created_at DESC
        `
      : await sql`
          SELECT p.*, t.name as client_name,
            (SELECT count(*) FROM deliverables d WHERE d.project_id = p.id) as deliverable_count
          FROM projects p
          JOIN tenants t ON t.id = p.tenant_id
          ORDER BY p.created_at DESC
        `
    return rows.map((r) => mapProjectRow(r))
  }
  return store.projects
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT p.*, t.name as client_name,
        (SELECT count(*) FROM deliverables d WHERE d.project_id = p.id) as deliverable_count
      FROM projects p
      JOIN tenants t ON t.id = p.tenant_id
      WHERE p.id = ${id}::uuid LIMIT 1
    `
    if (!rows.length) return null
    return mapProjectRow(rows[0])
  }
  return store.projects.find((p) => p.id === id) ?? null
}

interface CreateProjectInput {
  tenantId: string
  createdBy: string
  title: string
  type: string
  priority?: string
  clientName: string
  dueDate?: string
  budget?: number
}

function projectPriorityToDb(p?: string): string {
  if (!p) return "normal"
  if (p === "medium") return "normal"
  return p
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      INSERT INTO projects (tenant_id, created_by, title, project_type, priority, due_date, price_cents)
      VALUES (${input.tenantId}::uuid, ${input.createdBy}::uuid, ${input.title},
              ${input.type}, ${projectPriorityToDb(input.priority)},
              ${input.dueDate ? new Date(input.dueDate) : null},
              ${input.budget ? Math.round(input.budget * 100) : 0})
      RETURNING *
    `
    const r = rows[0]
    return mapProjectRow({ ...r, client_name: input.clientName, deliverable_count: 0 })
  }
  const id = uid("proj")
  const project: Project = {
    id,
    title: input.title,
    type: input.type as Project["type"],
    status: "draft",
    priority: (input.priority as Project["priority"]) ?? "medium",
    clientId: uid("c"),
    clientName: input.clientName,
    estimatedCost: input.budget ?? 0,
    actualCost: 0,
    aiCost: 0,
    confidenceScore: 0,
    autonomyLevel: "human_required",
    qualityScore: 0,
    dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliverableCount: 0,
    revisionCount: 0,
  }
  store.projects.push(project)
  return project
}

function appProjectStatusToDb(status: string): string {
  const map: Record<string, string> = {
    ai_generating: "processing",
    qa_check: "in_review",
    expert_review: "in_review",
    client_review: "in_review",
    revision: "revision_requested",
  }
  return map[status] ?? status
}

function projectPriorityPatchToDb(priority: string): string {
  return projectPriorityToDb(priority)
}

export async function updateProject(
  id: string,
  patch: Partial<{
    status: string
    qualityScore: number
    aiCost: number
    actualCost: number
    priority: string
    expertId: string | null
  }>,
): Promise<Project | null> {
  if (hasDb()) {
    const sql = getDb()!
    const statusDb = patch.status !== undefined ? appProjectStatusToDb(patch.status) : null
    const priorityDb =
      patch.priority !== undefined ? projectPriorityPatchToDb(patch.priority) : null
    await sql`
      UPDATE projects SET
        status = COALESCE(${statusDb}, status),
        quality_score = COALESCE(${patch.qualityScore ?? null}, quality_score),
        ai_cost_cents = COALESCE(${patch.aiCost !== undefined ? Math.round(patch.aiCost * 100) : null}, ai_cost_cents),
        priority = COALESCE(${priorityDb}, priority),
        updated_at = now()
      WHERE id = ${id}::uuid
    `
    if (patch.expertId !== undefined) {
      await sql`
        UPDATE projects SET assigned_expert = ${patch.expertId}, updated_at = now()
        WHERE id = ${id}::uuid
      `
    }
    return getProjectById(id)
  }
  const p = store.projects.find((p) => p.id === id)
  if (!p) return null
  if (patch.status) p.status = patch.status as Project["status"]
  if (patch.qualityScore !== undefined) p.qualityScore = patch.qualityScore
  if (patch.aiCost !== undefined) p.aiCost = patch.aiCost
  if (patch.actualCost !== undefined) p.actualCost = patch.actualCost
  if (patch.priority !== undefined) p.priority = patch.priority as Project["priority"]
  if (patch.expertId !== undefined) p.expertId = patch.expertId ?? undefined
  p.updatedAt = new Date().toISOString()
  return p
}

function mapProjectRow(r: Record<string, unknown>): Project {
  return {
    id: String(r.id),
    title: String(r.title),
    type: String(r.project_type ?? r.type) as Project["type"],
    status: mapProjectStatus(String(r.status)),
    priority: mapPriority(String(r.priority)),
    clientId: String(r.tenant_id ?? ""),
    clientName: String(r.client_name ?? ""),
    briefId: r.brief_id ? String(r.brief_id) : undefined,
    expertId: r.assigned_expert ? String(r.assigned_expert) : undefined,
    estimatedCost: Number(r.price_cents ?? 0) / 100,
    actualCost: Number(r.ai_cost_cents ?? 0) / 100,
    aiCost: Number(r.ai_cost_cents ?? 0) / 100,
    confidenceScore: Number(r.quality_score ?? 0),
    autonomyLevel: "spot_check",
    qualityScore: Number(r.quality_score ?? 0),
    dueDate: r.due_date ? new Date(r.due_date as string).toISOString() : "",
    createdAt: new Date(r.created_at as string).toISOString(),
    updatedAt: new Date(r.updated_at as string).toISOString(),
    deliverableCount: Number(r.deliverable_count ?? 0),
    revisionCount: 0,
  }
}

function mapProjectStatus(s: string): Project["status"] {
  const map: Record<string, Project["status"]> = {
    draft: "draft", submitted: "submitted", processing: "ai_generating",
    in_review: "expert_review", revision_requested: "revision",
    approved: "approved", delivered: "delivered", cancelled: "delivered",
  }
  return map[s] ?? (s as Project["status"])
}

function mapPriority(s: string): Project["priority"] {
  if (s === "normal") return "medium"
  return s as Project["priority"]
}

/* ------------------------------------------------------------------ */
/*  Deliverables                                                      */
/* ------------------------------------------------------------------ */

export async function getDeliverables(projectId?: string): Promise<Deliverable[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = projectId
      ? await sql`SELECT * FROM deliverables WHERE project_id = ${projectId}::uuid ORDER BY version DESC`
      : await sql`SELECT * FROM deliverables ORDER BY created_at DESC`
    return rows.map(mapDeliverableRow)
  }
  return projectId
    ? store.deliverables.filter((d) => d.projectId === projectId)
    : store.deliverables
}

function deliverableStatusToDb(status: string): string {
  if (status === "revision" || status === "qa_check") return "in_review"
  if (status === "generating") return "draft"
  if (["draft", "in_review", "approved", "rejected", "delivered"].includes(status)) return status
  return "in_review"
}

export async function createDeliverable(input: {
  projectId: string
  tenantId: string
  title: string
  type: string
  fileUrl: string
  aiModel: string
  generationCost: number
  generationTime: number
  qualityScore: number
  status?: string
}): Promise<Deliverable> {
  if (hasDb()) {
    const sql = getDb()!
    const statusDb = deliverableStatusToDb(input.status ?? "in_review")
    const rows = await sql`
      INSERT INTO deliverables (project_id, tenant_id, title, file_type, file_url, status, metadata)
      VALUES (${input.projectId}::uuid, ${input.tenantId}::uuid, ${input.title},
              ${input.type}, ${input.fileUrl}, ${statusDb},
              ${JSON.stringify({
                ai_model: input.aiModel,
                generation_cost: input.generationCost,
                generation_time: input.generationTime,
                quality_score: input.qualityScore,
              })})
      RETURNING *
    `
    return mapDeliverableRow(rows[0])
  }
  const del: Deliverable = {
    id: uid("del"),
    projectId: input.projectId,
    version: 1,
    title: input.title,
    type: input.type,
    fileUrl: input.fileUrl,
    thumbnailUrl: "",
    status: (input.status as Deliverable["status"]) ?? "qa_check",
    aiModel: input.aiModel,
    generationCost: input.generationCost,
    generationTime: input.generationTime,
    qualityScore: input.qualityScore,
    createdAt: new Date().toISOString(),
  }
  store.deliverables.push(del)
  return del
}

export async function updateDeliverable(
  id: string,
  patch: Partial<{ status: string }>,
): Promise<Deliverable | null> {
  if (hasDb()) {
    const sql = getDb()!
    const statusDb =
      patch.status === undefined ? null : deliverableStatusToDb(patch.status)
    const rows = await sql`
      UPDATE deliverables SET
        status = COALESCE(${statusDb}, status)
      WHERE id = ${id}::uuid
      RETURNING *
    `
    if (!rows.length) return null
    return mapDeliverableRow(rows[0])
  }
  const d = store.deliverables.find((x) => x.id === id)
  if (!d) return null
  if (patch.status) d.status = patch.status as Deliverable["status"]
  return d
}

function mapDeliverableRow(r: Record<string, unknown>): Deliverable {
  const meta = (r.metadata ?? {}) as Record<string, unknown>
  return {
    id: String(r.id),
    projectId: String(r.project_id),
    version: Number(r.version ?? 1),
    title: String(r.title),
    type: String(r.file_type ?? r.type ?? ""),
    fileUrl: String(r.file_url ?? ""),
    thumbnailUrl: String(r.thumbnail_url ?? ""),
    status: String(r.status ?? "generating") as Deliverable["status"],
    aiModel: String(meta.ai_model ?? ""),
    generationCost: Number(meta.generation_cost ?? 0),
    generationTime: Number(meta.generation_time ?? 0),
    qualityScore: Number(meta.quality_score ?? 0),
    createdAt: new Date(r.created_at as string).toISOString(),
  }
}

/* ------------------------------------------------------------------ */
/*  Reviews                                                           */
/* ------------------------------------------------------------------ */

export async function getReviews(tenantId?: string): Promise<Review[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT er.*, u.name as reviewer_name, u.role as reviewer_role
      FROM expert_reviews er
      JOIN users u ON u.id = er.expert_id
      ORDER BY er.created_at DESC
    `
    return rows.map(mapReviewRow)
  }
  return store.reviews
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT er.*, u.name as reviewer_name, u.role as reviewer_role
      FROM expert_reviews er
      JOIN users u ON u.id = er.expert_id
      WHERE er.id = ${id}::uuid LIMIT 1
    `
    if (!rows.length) return null
    return mapReviewRow(rows[0])
  }
  return store.reviews.find((r) => r.id === id) ?? null
}

export async function updateReview(
  id: string,
  patch: { status?: string; rating?: number },
): Promise<Review | null> {
  if (hasDb()) {
    const sql = getDb()!
    await sql`
      UPDATE expert_reviews SET
        status = COALESCE(${patch.status ?? null}, status),
        quality_score = COALESCE(${patch.rating ?? null}, quality_score),
        completed_at = CASE WHEN ${patch.status ?? null} = 'approved' THEN now() ELSE completed_at END
      WHERE id = ${id}::uuid
    `
    return getReviewById(id)
  }
  const r = store.reviews.find((r) => r.id === id)
  if (!r) return null
  if (patch.status) r.status = patch.status as Review["status"]
  if (patch.rating !== undefined) r.rating = patch.rating
  return r
}

export async function addReviewComment(
  reviewId: string,
  comment: { author: string; authorRole: string; content: string },
): Promise<ReviewComment> {
  const newComment: ReviewComment = {
    id: uid("cmt"),
    author: comment.author,
    authorRole: comment.authorRole as UserRole,
    content: comment.content,
    createdAt: new Date().toISOString(),
  }
  if (hasDb()) {
    const sql = getDb()!
    const review = await getReviewById(reviewId)
    if (review) {
      const comments = [...review.comments, newComment]
      await sql`
        UPDATE expert_reviews SET refinements = ${JSON.stringify(comments)}
        WHERE id = ${reviewId}::uuid
      `
    }
    return newComment
  }
  const r = store.reviews.find((r) => r.id === reviewId)
  if (r) r.comments.push(newComment)
  return newComment
}

function extractDeliverableId(notes: unknown): string {
  if (typeof notes === "string" && notes.startsWith("deliverable_id:")) {
    return notes.slice("deliverable_id:".length)
  }
  return ""
}

function mapReviewRow(r: Record<string, unknown>): Review {
  const refinements = r.refinements as ReviewComment[] | null
  return {
    id: String(r.id),
    deliverableId: extractDeliverableId(r.review_notes),
    projectId: String(r.project_id),
    reviewerId: String(r.expert_id),
    reviewerName: String(r.reviewer_name ?? ""),
    reviewerRole: String(r.reviewer_role ?? "expert") as UserRole,
    status: mapReviewStatus(String(r.status)),
    rating: Number(r.quality_score ?? 0),
    comments: Array.isArray(refinements) ? refinements : [],
    timeSpent: Number(r.time_spent_mins ?? 0),
    createdAt: new Date(r.created_at as string).toISOString(),
  }
}

function mapReviewStatus(s: string): Review["status"] {
  const map: Record<string, Review["status"]> = {
    pending: "pending", in_progress: "pending", approved: "approved",
    needs_revision: "revision_requested", escalated: "rejected",
  }
  return map[s] ?? (s as Review["status"])
}

/* ------------------------------------------------------------------ */
/*  Leads (CRM)                                                       */
/* ------------------------------------------------------------------ */

export async function getLeads(tenantId?: string): Promise<Lead[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = tenantId
      ? await sql`SELECT * FROM leads WHERE tenant_id = ${tenantId}::uuid ORDER BY created_at DESC`
      : await sql`SELECT * FROM leads ORDER BY created_at DESC`
    return rows.map(mapLeadRow)
  }
  return store.leads
}

export async function updateLead(
  id: string,
  patch: {
    status?: string
    notes?: string
    nextFollowUp?: string
    speculativeWorkUrl?: string | null
  },
): Promise<Lead | null> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      UPDATE leads SET
        status = COALESCE(${patch.status ?? null}, status),
        notes = COALESCE(${patch.notes ?? null}, notes),
        next_follow_up = COALESCE(
          ${patch.nextFollowUp ? new Date(patch.nextFollowUp) : null},
          next_follow_up
        ),
        speculative_work_url = COALESCE(${patch.speculativeWorkUrl ?? null}, speculative_work_url),
        last_contact_at = now(),
        updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING *
    `
    if (!rows.length) return null
    return mapLeadRow(rows[0])
  }
  const l = store.leads.find((l) => l.id === id)
  if (!l) return null
  if (patch.status) l.status = patch.status as Lead["status"]
  if (patch.notes !== undefined) l.notes = patch.notes
  if (patch.nextFollowUp !== undefined) l.nextFollowUp = patch.nextFollowUp
  if (patch.speculativeWorkUrl !== undefined) {
    l.speculativeWorkUrl = patch.speculativeWorkUrl ?? undefined
  }
  l.lastContactAt = new Date().toISOString()
  return l
}

export async function createLead(input: {
  tenantId: string
  company: string
  contactName: string
  email: string
  value?: number
  source?: string
  notes?: string
}): Promise<Lead> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      INSERT INTO leads (tenant_id, company, contact_name, email, value_cents, source, notes, status)
      VALUES (
        ${input.tenantId}::uuid,
        ${input.company},
        ${input.contactName},
        ${input.email},
        ${Math.round((input.value ?? 0) * 100)},
        ${input.source ?? ""},
        ${input.notes ?? ""},
        'new'
      )
      RETURNING *
    `
    return mapLeadRow(rows[0])
  }
  const lead: Lead = {
    id: uid("lead"),
    company: input.company,
    contactName: input.contactName,
    email: input.email,
    status: "new",
    value: typeof input.value === "number" ? input.value : 0,
    source: input.source ?? "",
    notes: input.notes ?? "",
    createdAt: new Date().toISOString(),
    lastContactAt: new Date().toISOString(),
  }
  store.leads.push(lead)
  return lead
}

function mapLeadRow(r: Record<string, unknown>): Lead {
  return {
    id: String(r.id),
    company: String(r.company),
    contactName: String(r.contact_name),
    email: String(r.email),
    phone: r.phone ? String(r.phone) : undefined,
    status: String(r.status) as Lead["status"],
    value: Number(r.value_cents ?? 0) / 100,
    source: String(r.source ?? ""),
    notes: String(r.notes ?? ""),
    speculativeWorkUrl: r.speculative_work_url ? String(r.speculative_work_url) : undefined,
    createdAt: new Date(r.created_at as string).toISOString(),
    lastContactAt: r.last_contact_at ? new Date(r.last_contact_at as string).toISOString() : "",
    nextFollowUp: r.next_follow_up ? new Date(r.next_follow_up as string).toISOString() : undefined,
  }
}

/* ------------------------------------------------------------------ */
/*  Brands                                                            */
/* ------------------------------------------------------------------ */

export async function getBrandProfiles(tenantId?: string): Promise<BrandProfile[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = tenantId
      ? await sql`SELECT * FROM brand_profiles WHERE tenant_id = ${tenantId}::uuid`
      : await sql`SELECT * FROM brand_profiles ORDER BY created_at DESC`
    return rows.map(mapBrandRow)
  }
  return store.brandProfiles
}

function mapBrandRow(r: Record<string, unknown>): BrandProfile {
  return {
    id: String(r.id),
    tenantId: String(r.tenant_id),
    name: String(r.name),
    websiteUrl: "",
    logoUrl: Array.isArray(r.logo_urls) && (r.logo_urls as string[]).length ? String((r.logo_urls as string[])[0]) : "",
    colors: Array.isArray(r.colors) ? (r.colors as BrandProfile["colors"]) : [],
    fonts: Array.isArray(r.fonts) ? (r.fonts as BrandProfile["fonts"]) : [],
    toneOfVoice: String(r.tone_of_voice ?? ""),
    values: [],
    targetAudience: String(r.target_audience ?? ""),
    industry: String(r.industry ?? ""),
    competitors: [],
    assets: [],
    dnaScore: 0,
    projectsCompleted: 0,
    lastUpdated: new Date(r.updated_at as string).toISOString(),
  }
}

/* ------------------------------------------------------------------ */
/*  Simple read-only queries (all follow the same pattern)            */
/* ------------------------------------------------------------------ */

export async function getDashboardStats(tenantId?: string) {
  if (hasDb()) {
    const sql = getDb()!
    const [projRows, revRows, costRows] = tenantId
      ? await Promise.all([
          sql`SELECT count(*) as total, count(*) FILTER (WHERE status NOT IN ('delivered','cancelled')) as active FROM projects WHERE tenant_id = ${tenantId}::uuid`,
          sql`SELECT count(DISTINCT tenant_id) as clients FROM projects WHERE tenant_id = ${tenantId}::uuid`,
          sql`SELECT COALESCE(sum(ai_cost_cents),0) as total_ai_cost, COALESCE(sum(price_cents),0) as total_revenue FROM projects WHERE tenant_id = ${tenantId}::uuid`,
        ])
      : await Promise.all([
          sql`SELECT count(*) as total, count(*) FILTER (WHERE status NOT IN ('delivered','cancelled')) as active FROM projects`,
          sql`SELECT count(DISTINCT tenant_id) as clients FROM projects`,
          sql`SELECT COALESCE(sum(ai_cost_cents),0) as total_ai_cost, COALESCE(sum(price_cents),0) as total_revenue FROM projects`,
        ])
    const total = Number(projRows[0]?.total ?? 0)
    const active = Number(projRows[0]?.active ?? 0)
    const totalRevenue = Number(costRows[0]?.total_revenue ?? 0) / 100
    const totalAiCost = Number(costRows[0]?.total_ai_cost ?? 0) / 100
    return {
      totalRevenue,
      monthlyRevenue: totalRevenue > 0 ? Math.round(totalRevenue / Math.max(1, Math.ceil(total / 3))) : 0,
      revenueGrowth: 0.12,
      activeProjects: active,
      totalProjects: total,
      avgMargin: totalRevenue > 0 ? (totalRevenue - totalAiCost) / totalRevenue : 0,
      avgQualityScore: 8.5,
      avgTurnaround: 4.2,
      totalClients: Number(revRows[0]?.clients ?? 0),
      activeClients: Number(revRows[0]?.clients ?? 0),
      pipelineValue: 0,
      expertUtilization: 0.78,
      autonomousRate: 0.41,
      aiCostPerProject: total > 0 ? Math.round(totalAiCost / total) : 0,
    }
  }
  return {
    ...store.dashboardStats,
    activeProjects: store.projects.filter((p) => !["delivered", "draft"].includes(p.status)).length,
    totalProjects: store.projects.length,
  }
}

export async function getBilling(tenantId?: string): Promise<{
  invoices: Invoice[]
  creditPacks: CreditPack[]
  usage: UsageRecord[]
}> {
  if (hasDb()) {
    const sql = getDb()!
    const [invRows, cpRows, usageRows] = tenantId
      ? await Promise.all([
          sql`SELECT i.*, t.name as client_name FROM invoices i JOIN tenants t ON t.id = i.tenant_id WHERE i.tenant_id = ${tenantId}::uuid ORDER BY i.created_at DESC`,
          sql`SELECT * FROM credit_packs ORDER BY price_cents ASC`,
          sql`SELECT * FROM usage_records WHERE tenant_id = ${tenantId}::uuid ORDER BY month DESC`,
        ])
      : await Promise.all([
          sql`SELECT i.*, t.name as client_name FROM invoices i JOIN tenants t ON t.id = i.tenant_id ORDER BY i.created_at DESC`,
          sql`SELECT * FROM credit_packs ORDER BY price_cents ASC`,
          sql`SELECT * FROM usage_records ORDER BY month DESC`,
        ])
    return {
      invoices: invRows.map(mapInvoiceRow),
      creditPacks: cpRows.map(mapCreditPackRow),
      usage: usageRows.map(mapUsageRow),
    }
  }
  return {
    invoices: store.invoices,
    creditPacks: store.creditPacks,
    usage: store.usageRecords,
  }
}

function mapInvoiceRow(r: Record<string, unknown>): Invoice {
  return {
    id: String(r.id),
    tenantId: String(r.tenant_id),
    clientName: String(r.client_name ?? r.tenant_name ?? ""),
    amount: Number(r.amount_cents ?? 0) / 100,
    status: String(r.status) as Invoice["status"],
    items: Array.isArray(r.line_items) ? (r.line_items as Invoice["items"]) : [],
    createdAt: new Date(r.created_at as string).toISOString(),
    dueDate: r.due_date ? new Date(r.due_date as string).toISOString() : "",
    paidAt: r.paid_at ? new Date(r.paid_at as string).toISOString() : undefined,
  }
}

function mapCreditPackRow(r: Record<string, unknown>): CreditPack {
  return {
    id: String(r.id),
    name: String(r.name),
    credits: Number(r.credits),
    price: Number(r.price_cents ?? 0) / 100,
    pricePerCredit: Number(r.price_per_credit ?? 0),
    popular: Boolean(r.popular),
    features: Array.isArray(r.features) ? (r.features as string[]) : [],
  }
}

function mapUsageRow(r: Record<string, unknown>): UsageRecord {
  return {
    tenantId: String(r.tenant_id),
    month: String(r.month),
    projectsCompleted: Number(r.projects_completed ?? 0),
    creditsUsed: Number(r.credits_used ?? 0),
    creditsRemaining: Number(r.credits_remaining ?? 0),
    totalSpend: Number(r.total_spend_cents ?? 0) / 100,
    aiCost: Number(r.ai_cost_cents ?? 0) / 100,
    margin: Number(r.margin ?? 0),
  }
}

export async function getPipelines(): Promise<Pipeline[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT pr.*, p.title as project_title
      FROM pipeline_runs pr
      JOIN projects p ON p.id = pr.project_id
      ORDER BY pr.created_at DESC
    `
    const pipelines: Pipeline[] = []
    for (const r of rows) {
      const taskRows = await sql`
        SELECT * FROM pipeline_tasks WHERE pipeline_run_id = ${r.id}::uuid ORDER BY sort_order
      `
      pipelines.push({
        id: String(r.id),
        projectId: String(r.project_id),
        projectTitle: String(r.project_title ?? ""),
        tasks: taskRows.map(mapTaskRow),
        status: String(r.status) as Pipeline["status"],
        totalCost: Number(r.total_cost_cents ?? 0) / 100,
        totalTime: 0,
        startedAt: r.started_at ? new Date(r.started_at as string).toISOString() : "",
        completedAt: r.completed_at ? new Date(r.completed_at as string).toISOString() : undefined,
      })
    }
    return pipelines
  }
  return store.pipelines
}

function mapTaskRow(r: Record<string, unknown>): Pipeline["tasks"][0] {
  return {
    id: String(r.id),
    pipelineId: String(r.pipeline_run_id),
    type: String(r.task_type),
    modelId: "",
    modelName: String(r.model_name ?? ""),
    status: String(r.status) as Pipeline["tasks"][0]["status"],
    input: String(r.prompt ?? ""),
    output: r.output_data ? JSON.stringify(r.output_data) : undefined,
    cost: Number(r.cost_cents ?? 0) / 100,
    latencyMs: Number(r.latency_ms ?? 0),
    retryCount: Number(r.attempts ?? 0),
    createdAt: new Date(r.created_at as string).toISOString(),
    completedAt: r.completed_at ? new Date(r.completed_at as string).toISOString() : undefined,
  }
}

export async function getAIModels(): Promise<AIModel[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM ai_models ORDER BY name`
    return rows.map((r) => ({
      id: String(r.id),
      provider: String(r.provider) as AIModel["provider"],
      name: String(r.name),
      capabilities: Array.isArray(r.capabilities) ? (r.capabilities as string[]) : [],
      costPer1kTokens: Number(r.cost_per_1k_tokens ?? 0),
      avgLatencyMs: Number(r.avg_latency_ms ?? 0),
      qualityScore: Number(r.quality_score ?? 0),
      isActive: Boolean(r.is_active),
    }))
  }
  return store.aiModels
}

export async function getExpertAssignments(tenantId?: string): Promise<ExpertAssignment[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = tenantId
      ? await sql`
          SELECT ea.*, p.title as project_title, p.project_type, u.name as expert_name
          FROM expert_assignments ea
          JOIN projects p ON p.id = ea.project_id
          JOIN users u ON u.id = ea.expert_id
          WHERE ea.tenant_id = ${tenantId}::uuid
          ORDER BY ea.created_at DESC
        `
      : await sql`
          SELECT ea.*, p.title as project_title, p.project_type, u.name as expert_name
          FROM expert_assignments ea
          JOIN projects p ON p.id = ea.project_id
          JOIN users u ON u.id = ea.expert_id
          ORDER BY ea.created_at DESC
        `
    return rows.map((r) => ({
      id: String(r.id),
      projectId: String(r.project_id),
      projectTitle: String(r.project_title ?? ""),
      projectType: String(r.project_type ?? "") as ExpertAssignment["projectType"],
      expertId: String(r.expert_id),
      expertName: String(r.expert_name ?? ""),
      status: String(r.status) as ExpertAssignment["status"],
      escalationLevel: String(r.escalation_level ?? "standard") as ExpertAssignment["escalationLevel"],
      priority: mapPriority(String(r.priority ?? "normal")),
      claimedAt: r.claimed_at ? new Date(r.claimed_at as string).toISOString() : undefined,
      completedAt: r.completed_at ? new Date(r.completed_at as string).toISOString() : undefined,
      reviewTimeMinutes: Number(r.review_time_minutes ?? 0),
      qualityBefore: Number(r.quality_before ?? 0),
      qualityAfter: Number(r.quality_after ?? 0),
    }))
  }
  return store.expertAssignments
}

export async function updateExpertAssignment(
  id: string,
  patch: Partial<{
    status: string
    claimedAt: string
    completedAt: string
    reviewTimeMinutes: number
    qualityAfter: number
    escalationLevel: string
  }>,
): Promise<ExpertAssignment | null> {
  if (hasDb()) {
    const sql = getDb()!
    await sql`
      UPDATE expert_assignments SET
        status = COALESCE(${patch.status ?? null}, status),
        claimed_at = COALESCE(${patch.claimedAt ? new Date(patch.claimedAt) : null}, claimed_at),
        completed_at = COALESCE(${patch.completedAt ? new Date(patch.completedAt) : null}, completed_at),
        review_time_minutes = COALESCE(${patch.reviewTimeMinutes ?? null}, review_time_minutes),
        quality_after = COALESCE(${patch.qualityAfter ?? null}, quality_after),
        escalation_level = COALESCE(${patch.escalationLevel ?? null}, escalation_level)
      WHERE id = ${id}::uuid
    `
    const rows = await sql`
      SELECT ea.*, p.title as project_title, p.project_type, u.name as expert_name
      FROM expert_assignments ea
      JOIN projects p ON p.id = ea.project_id
      JOIN users u ON u.id = ea.expert_id
      WHERE ea.id = ${id}::uuid
    `
    if (!rows.length) return null
    const r = rows[0]
    return {
      id: String(r.id),
      projectId: String(r.project_id),
      projectTitle: String(r.project_title ?? ""),
      projectType: String(r.project_type ?? "") as ExpertAssignment["projectType"],
      expertId: String(r.expert_id),
      expertName: String(r.expert_name ?? ""),
      status: String(r.status) as ExpertAssignment["status"],
      escalationLevel: String(r.escalation_level ?? "standard") as ExpertAssignment["escalationLevel"],
      priority: mapPriority(String(r.priority ?? "normal")),
      claimedAt: r.claimed_at ? new Date(r.claimed_at as string).toISOString() : undefined,
      completedAt: r.completed_at ? new Date(r.completed_at as string).toISOString() : undefined,
      reviewTimeMinutes: Number(r.review_time_minutes ?? 0),
      qualityBefore: Number(r.quality_before ?? 0),
      qualityAfter: Number(r.quality_after ?? 0),
    }
  }
  const a = store.expertAssignments.find((x) => x.id === id)
  if (!a) return null
  if (patch.status !== undefined) a.status = patch.status as ExpertAssignment["status"]
  if (patch.claimedAt !== undefined) a.claimedAt = patch.claimedAt
  if (patch.completedAt !== undefined) a.completedAt = patch.completedAt
  if (patch.reviewTimeMinutes !== undefined) a.reviewTimeMinutes = patch.reviewTimeMinutes
  if (patch.qualityAfter !== undefined) a.qualityAfter = patch.qualityAfter
  if (patch.escalationLevel !== undefined) {
    a.escalationLevel = patch.escalationLevel as ExpertAssignment["escalationLevel"]
  }
  return { ...a }
}

export async function updatePublishingJob(
  id: string,
  patch: Partial<{
    status: string
    scheduledAt: string | null
    publishedAt: string | null
    metrics: PublishingJob["metrics"]
  }>,
): Promise<PublishingJob | null> {
  if (hasDb()) {
    const sql = getDb()!
    if (patch.status === "live") {
      await sql`
        UPDATE publishing_jobs SET
          status = 'live',
          published_at = COALESCE(published_at, now())
        WHERE id = ${id}::uuid
      `
    } else if (patch.status === "scheduled" && patch.scheduledAt) {
      await sql`
        UPDATE publishing_jobs SET
          status = 'scheduled',
          scheduled_at = ${new Date(patch.scheduledAt)}
        WHERE id = ${id}::uuid
      `
    } else if (patch.status) {
      await sql`
        UPDATE publishing_jobs SET status = ${patch.status}
        WHERE id = ${id}::uuid
      `
    }
    const rows = await sql`SELECT * FROM publishing_jobs WHERE id = ${id}::uuid LIMIT 1`
    if (!rows.length) return null
    const r = rows[0]
    return {
      id: String(r.id),
      deliverableId: String(r.deliverable_id ?? ""),
      projectTitle: String(r.project_title ?? ""),
      channel: String(r.channel) as PublishingJob["channel"],
      status: String(r.status) as PublishingJob["status"],
      scheduledAt: r.scheduled_at ? new Date(r.scheduled_at as string).toISOString() : undefined,
      publishedAt: r.published_at ? new Date(r.published_at as string).toISOString() : undefined,
      metrics: r.metrics as PublishingJob["metrics"],
    }
  }
  const j = store.publishingJobs.find((x) => x.id === id)
  if (!j) return null
  if (patch.status !== undefined) j.status = patch.status as PublishingJob["status"]
  if (patch.scheduledAt !== undefined) {
    j.scheduledAt = patch.scheduledAt ?? undefined
  }
  if (patch.publishedAt !== undefined) {
    j.publishedAt = patch.publishedAt ?? undefined
  }
  if (patch.metrics !== undefined) j.metrics = patch.metrics
  return { ...j }
}

export async function getAutonomyConfigs(): Promise<AutonomyConfig[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM autonomy_configs ORDER BY task_type`
    return rows.map((r) => ({
      id: String(r.id),
      taskType: String(r.task_type) as AutonomyConfig["taskType"],
      taskLabel: String(r.task_label),
      currentLevel: String(r.current_level) as AutonomyConfig["currentLevel"],
      confidenceScore: Number(r.confidence_score ?? 0),
      totalCompleted: Number(r.total_completed ?? 0),
      successRate: Number(r.success_rate ?? 0),
      revisionRate: Number(r.revision_rate ?? 0),
      avgQualityScore: Number(r.avg_quality_score ?? 0),
      lastEscalation: r.last_escalation ? new Date(r.last_escalation as string).toISOString() : undefined,
      trend: String(r.trend ?? "stable") as AutonomyConfig["trend"],
      projectedAutonomyDate: r.projected_autonomy_date
        ? new Date(r.projected_autonomy_date as string).toISOString()
        : undefined,
    }))
  }
  return store.autonomyConfigs
}

export async function getPerformanceMetrics(): Promise<PerformanceMetric[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT pm.*, p.title as project_title
      FROM performance_metrics pm
      LEFT JOIN projects p ON p.id = pm.project_id
      ORDER BY pm.measured_at DESC
    `
    return rows.map((r) => ({
      id: String(r.id),
      deliverableId: r.deliverable_id ? String(r.deliverable_id) : "",
      projectTitle: String(r.project_title ?? ""),
      channel: String(r.channel) as PerformanceMetric["channel"],
      impressions: Number(r.impressions ?? 0),
      clicks: Number(r.clicks ?? 0),
      ctr: Number(r.ctr ?? 0),
      conversions: Number(r.conversions ?? 0),
      spend: Number(r.spend_cents ?? 0) / 100,
      roi: Number(r.roi ?? 0),
      measuredAt: new Date(r.measured_at as string).toISOString(),
    }))
  }
  return store.performanceMetrics
}

export async function getSuggestions(): Promise<ProactiveSuggestion[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM suggestions ORDER BY created_at DESC`
    return rows.map((r) => ({
      id: String(r.id),
      tenantId: String(r.tenant_id),
      clientName: String(r.client_name),
      type: String(r.project_type) as ProactiveSuggestion["type"],
      title: String(r.title),
      description: String(r.description ?? ""),
      reasoning: String(r.reasoning ?? ""),
      previewUrl: r.preview_url ? String(r.preview_url) : undefined,
      trendSource: String(r.trend_source ?? ""),
      relevanceScore: Number(r.relevance_score ?? 0),
      estimatedValue: Number(r.estimated_value_cents ?? 0) / 100,
      status: String(r.status) as ProactiveSuggestion["status"],
      createdAt: new Date(r.created_at as string).toISOString(),
      expiresAt: r.expires_at ? new Date(r.expires_at as string).toISOString() : "",
    }))
  }
  return store.suggestions
}

export async function getFeedbackTranslations(): Promise<FeedbackTranslation[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM feedback_translations ORDER BY created_at DESC`
    return rows.map((r) => ({
      id: String(r.id),
      original: String(r.original),
      translated: String(r.translated),
      confidence: Number(r.confidence ?? 0),
      category: String(r.category ?? "general") as FeedbackTranslation["category"],
      actionableItems: Array.isArray(r.actionable_items) ? (r.actionable_items as FeedbackTranslation["actionableItems"]) : [],
    }))
  }
  return store.feedbackTranslations
}

export async function getPublishing(): Promise<{
  jobs: PublishingJob[]
  channels: ChannelConfig[]
}> {
  if (hasDb()) {
    const sql = getDb()!
    const [jobRows, chRows] = await Promise.all([
      sql`SELECT * FROM publishing_jobs ORDER BY created_at DESC`,
      sql`SELECT * FROM channel_configs ORDER BY channel`,
    ])
    return {
      jobs: jobRows.map((r) => ({
        id: String(r.id),
        deliverableId: String(r.deliverable_id ?? ""),
        projectTitle: String(r.project_title ?? ""),
        channel: String(r.channel) as PublishingJob["channel"],
        status: String(r.status) as PublishingJob["status"],
        scheduledAt: r.scheduled_at ? new Date(r.scheduled_at as string).toISOString() : undefined,
        publishedAt: r.published_at ? new Date(r.published_at as string).toISOString() : undefined,
        metrics: r.metrics as PublishingJob["metrics"],
      })),
      channels: chRows.map((r) => ({
        channel: String(r.channel) as ChannelConfig["channel"],
        label: String(r.label),
        connected: Boolean(r.connected),
        accountName: r.account_name ? String(r.account_name) : undefined,
        lastSync: r.last_sync ? new Date(r.last_sync as string).toISOString() : undefined,
      })),
    }
  }
  return {
    jobs: store.publishingJobs,
    channels: store.channelConfigs,
  }
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM benchmarks ORDER BY category, metric`
    return rows.map((r) => ({
      id: String(r.id),
      category: String(r.category),
      metric: String(r.metric),
      yourValue: Number(r.your_value ?? 0),
      industryAvg: Number(r.industry_avg ?? 0),
      topPerformer: Number(r.top_performer ?? 0),
      percentile: Number(r.percentile ?? 0),
      trend: String(r.trend ?? "stable") as Benchmark["trend"],
      unit: String(r.unit ?? ""),
    }))
  }
  return store.benchmarks
}

export async function getSla(): Promise<{ tiers: SLATier[]; compliance: SLACompliance[] }> {
  if (hasDb()) {
    const sql = getDb()!
    const [tierRows, compRows] = await Promise.all([
      sql`SELECT * FROM sla_tiers ORDER BY first_draft_hours DESC`,
      sql`SELECT sc.*, p.title as project_title FROM sla_compliance sc LEFT JOIN projects p ON p.id = sc.project_id ORDER BY sc.created_at DESC`,
    ])
    return {
      tiers: tierRows.map((r) => ({
        tier: String(r.tier) as SLATier["tier"],
        firstDraftHours: Number(r.first_draft_hours),
        finalDeliveryHours: Number(r.final_delivery_hours),
        revisionTurnaroundHours: Number(r.revision_turnaround_hours),
        maxRevisions: Number(r.max_revisions),
        guaranteedCredits: Number(r.guaranteed_credits),
        penaltyPercent: Number(r.penalty_percent),
      })),
      compliance: compRows.map((r) => ({
        id: String(r.id),
        projectId: String(r.project_id),
        projectTitle: String(r.project_title ?? ""),
        clientName: String(r.client_name),
        tier: String(r.tier) as SLACompliance["tier"],
        metric: String(r.metric),
        targetHours: Number(r.target_hours),
        actualHours: Number(r.actual_hours),
        status: String(r.status) as SLACompliance["status"],
        creditIssued: Number(r.credit_issued),
      })),
    }
  }
  return { tiers: store.slaTiers, compliance: store.slaCompliance }
}

export async function getRevenueMetrics(): Promise<RevenueMetric[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM revenue_metrics ORDER BY month ASC`
    return rows.map((r) => ({
      month: String(r.month),
      revenue: Number(r.revenue_cents ?? 0) / 100,
      cost: Number(r.cost_cents ?? 0) / 100,
      profit: Number(r.profit_cents ?? 0) / 100,
      margin: Number(r.margin ?? 0),
      projects: Number(r.projects ?? 0),
      clients: Number(r.clients ?? 0),
    }))
  }
  return store.revenueMetrics
}

export async function getCostBreakdown(): Promise<CostBreakdown[]> {
  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`SELECT * FROM cost_breakdown ORDER BY amount_cents DESC`
    return rows.map((r) => ({
      category: String(r.category),
      amount: Number(r.amount_cents ?? 0) / 100,
      percentage: Number(r.percentage ?? 0),
      trend: String(r.trend ?? "stable") as CostBreakdown["trend"],
    }))
  }
  return store.costBreakdown
}
