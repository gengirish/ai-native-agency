-- Projects (top-level container for client work)
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    brand_profile_id UUID REFERENCES brand_profiles(id),
    created_by      UUID NOT NULL REFERENCES users(id),
    assigned_expert UUID REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    project_type    VARCHAR(50) NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','submitted','processing','in_review',
                                      'revision_requested','approved','delivered','cancelled')),
    priority        VARCHAR(20) NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('low','normal','high','urgent')),
    due_date        TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    ai_cost_cents   INTEGER NOT NULL DEFAULT 0,
    price_cents     INTEGER NOT NULL DEFAULT 0,
    quality_score   NUMERIC(3,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Briefs (structured input from client for a project)
CREATE TABLE briefs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    brief_type      VARCHAR(50) NOT NULL,
    content         JSONB NOT NULL DEFAULT '{}',
    reference_urls  TEXT[] DEFAULT '{}',
    target_audience TEXT,
    tone            VARCHAR(50),
    dimensions      JSONB,
    additional_notes TEXT,
    submitted_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_expert ON projects(assigned_expert);
CREATE INDEX idx_briefs_project ON briefs(project_id);
