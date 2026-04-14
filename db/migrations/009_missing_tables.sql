-- CRM Leads
CREATE TABLE IF NOT EXISTS leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company         VARCHAR(255) NOT NULL,
    contact_name    VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    status          VARCHAR(30) NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new','contacted','demo_scheduled','proposal_sent','negotiating','won','lost')),
    value_cents     INTEGER NOT NULL DEFAULT 0,
    source          VARCHAR(100),
    notes           TEXT,
    speculative_work_url TEXT,
    last_contact_at TIMESTAMPTZ,
    next_follow_up  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- AI Model Registry
CREATE TABLE IF NOT EXISTS ai_models (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    capabilities    TEXT[] DEFAULT '{}',
    cost_per_1k_tokens NUMERIC(10,6) NOT NULL DEFAULT 0,
    avg_latency_ms  INTEGER NOT NULL DEFAULT 0,
    quality_score   NUMERIC(3,2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert Assignments (separate from expert_reviews — task queue)
CREATE TABLE IF NOT EXISTS expert_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    expert_id       UUID NOT NULL REFERENCES users(id),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued','claimed','in_review','completed','escalated')),
    escalation_level VARCHAR(30) NOT NULL DEFAULT 'standard'
                    CHECK (escalation_level IN ('standard','senior','manual_required')),
    priority        VARCHAR(20) NOT NULL DEFAULT 'normal',
    claimed_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    review_time_minutes INTEGER NOT NULL DEFAULT 0,
    quality_before  NUMERIC(3,1) NOT NULL DEFAULT 0,
    quality_after   NUMERIC(3,1) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expert_assignments_project ON expert_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_expert_assignments_expert ON expert_assignments(expert_id);

-- Autonomy Configs
CREATE TABLE IF NOT EXISTS autonomy_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    task_type       VARCHAR(50) NOT NULL,
    task_label      VARCHAR(100) NOT NULL,
    current_level   VARCHAR(20) NOT NULL DEFAULT 'human_required'
                    CHECK (current_level IN ('human_required','spot_check','autonomous')),
    confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0,
    total_completed INTEGER NOT NULL DEFAULT 0,
    success_rate    NUMERIC(3,2) NOT NULL DEFAULT 0,
    revision_rate   NUMERIC(3,2) NOT NULL DEFAULT 0,
    avg_quality_score NUMERIC(3,1) NOT NULL DEFAULT 0,
    last_escalation TIMESTAMPTZ,
    trend           VARCHAR(20) NOT NULL DEFAULT 'stable'
                    CHECK (trend IN ('improving','stable','declining')),
    projected_autonomy_date TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, task_type)
);

-- Performance Metrics (ad/channel performance per deliverable)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id  UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel         VARCHAR(30) NOT NULL,
    impressions     INTEGER NOT NULL DEFAULT 0,
    clicks          INTEGER NOT NULL DEFAULT 0,
    ctr             NUMERIC(5,4) NOT NULL DEFAULT 0,
    conversions     INTEGER NOT NULL DEFAULT 0,
    spend_cents     INTEGER NOT NULL DEFAULT 0,
    roi             NUMERIC(6,2) NOT NULL DEFAULT 0,
    measured_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_tenant ON performance_metrics(tenant_id);

-- Proactive Suggestions
CREATE TABLE IF NOT EXISTS suggestions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_name     VARCHAR(255) NOT NULL,
    project_type    VARCHAR(50) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    reasoning       TEXT,
    preview_url     TEXT,
    trend_source    VARCHAR(255),
    relevance_score NUMERIC(3,2) NOT NULL DEFAULT 0,
    estimated_value_cents INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','accepted','rejected','generated')),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feedback Translations
CREATE TABLE IF NOT EXISTS feedback_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    original        TEXT NOT NULL,
    translated      TEXT NOT NULL,
    confidence      NUMERIC(3,2) NOT NULL DEFAULT 0,
    category        VARCHAR(30) NOT NULL DEFAULT 'general',
    actionable_items JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Publishing Jobs
CREATE TABLE IF NOT EXISTS publishing_jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id  UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_title   VARCHAR(255),
    channel         VARCHAR(30) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','scheduled','publishing','live','paused','failed')),
    scheduled_at    TIMESTAMPTZ,
    published_at    TIMESTAMPTZ,
    metrics         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_tenant ON publishing_jobs(tenant_id);

-- Channel Configs
CREATE TABLE IF NOT EXISTS channel_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel         VARCHAR(30) NOT NULL,
    label           VARCHAR(100) NOT NULL,
    connected       BOOLEAN NOT NULL DEFAULT false,
    account_name    VARCHAR(255),
    last_sync       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, channel)
);

-- Benchmarks
CREATE TABLE IF NOT EXISTS benchmarks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
    category        VARCHAR(100) NOT NULL,
    metric          VARCHAR(255) NOT NULL,
    your_value      NUMERIC(10,4) NOT NULL DEFAULT 0,
    industry_avg    NUMERIC(10,4) NOT NULL DEFAULT 0,
    top_performer   NUMERIC(10,4) NOT NULL DEFAULT 0,
    percentile      INTEGER NOT NULL DEFAULT 0,
    trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                    CHECK (trend IN ('up','down','stable')),
    unit            VARCHAR(10),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SLA Tiers (config table)
CREATE TABLE IF NOT EXISTS sla_tiers (
    tier            VARCHAR(30) PRIMARY KEY,
    first_draft_hours INTEGER NOT NULL,
    final_delivery_hours INTEGER NOT NULL,
    revision_turnaround_hours INTEGER NOT NULL,
    max_revisions   INTEGER NOT NULL,
    guaranteed_credits INTEGER NOT NULL DEFAULT 0,
    penalty_percent NUMERIC(4,2) NOT NULL DEFAULT 0
);

-- SLA Compliance (per-project tracking)
CREATE TABLE IF NOT EXISTS sla_compliance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_name     VARCHAR(255) NOT NULL,
    tier            VARCHAR(30) NOT NULL REFERENCES sla_tiers(tier),
    metric          VARCHAR(100) NOT NULL,
    target_hours    INTEGER NOT NULL,
    actual_hours    INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'on_track'
                    CHECK (status IN ('on_track','at_risk','breached')),
    credit_issued   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sla_compliance_project ON sla_compliance(project_id);

-- Credit Packs (product pricing config)
CREATE TABLE IF NOT EXISTS credit_packs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    credits         INTEGER NOT NULL,
    price_cents     INTEGER NOT NULL,
    price_per_credit NUMERIC(6,4) NOT NULL,
    popular         BOOLEAN NOT NULL DEFAULT false,
    features        TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Revenue Metrics (monthly snapshots)
CREATE TABLE IF NOT EXISTS revenue_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    month           VARCHAR(7) NOT NULL,
    revenue_cents   INTEGER NOT NULL DEFAULT 0,
    cost_cents      INTEGER NOT NULL DEFAULT 0,
    profit_cents    INTEGER NOT NULL DEFAULT 0,
    margin          NUMERIC(4,3) NOT NULL DEFAULT 0,
    projects        INTEGER NOT NULL DEFAULT 0,
    clients         INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, month)
);

-- Cost Breakdown (per-category cost tracking)
CREATE TABLE IF NOT EXISTS cost_breakdown (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category        VARCHAR(100) NOT NULL,
    amount_cents    INTEGER NOT NULL DEFAULT 0,
    percentage      NUMERIC(5,2) NOT NULL DEFAULT 0,
    trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                    CHECK (trend IN ('up','down','stable')),
    period          VARCHAR(7),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage Records (monthly usage per tenant)
CREATE TABLE IF NOT EXISTS usage_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    month           VARCHAR(7) NOT NULL,
    projects_completed INTEGER NOT NULL DEFAULT 0,
    credits_used    INTEGER NOT NULL DEFAULT 0,
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    total_spend_cents INTEGER NOT NULL DEFAULT 0,
    ai_cost_cents   INTEGER NOT NULL DEFAULT 0,
    margin          NUMERIC(4,3) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, month)
);
