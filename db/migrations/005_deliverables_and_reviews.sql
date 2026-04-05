-- Deliverables (generated assets delivered to client)
CREATE TABLE deliverables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    pipeline_task_id UUID REFERENCES pipeline_tasks(id),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    file_type       VARCHAR(50) NOT NULL,
    file_url        TEXT NOT NULL,
    thumbnail_url   TEXT,
    file_size_bytes BIGINT,
    version         INTEGER NOT NULL DEFAULT 1,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','in_review','approved','rejected','delivered')),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expert reviews (human-in-the-loop review records)
CREATE TABLE expert_reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    expert_id       UUID NOT NULL REFERENCES users(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','in_progress','approved','needs_revision','escalated')),
    quality_score   NUMERIC(3,2),
    review_notes    TEXT,
    refinements     JSONB NOT NULL DEFAULT '[]',
    time_spent_mins INTEGER,
    claimed_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Client feedback (comments on deliverables)
CREATE TABLE client_feedback (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id  UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    comment         TEXT NOT NULL,
    feedback_type   VARCHAR(20) NOT NULL DEFAULT 'comment'
                    CHECK (feedback_type IN ('comment','approval','revision_request','rejection')),
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deliverables_project ON deliverables(project_id);
CREATE INDEX idx_deliverables_tenant ON deliverables(tenant_id);
CREATE INDEX idx_expert_reviews_project ON expert_reviews(project_id);
CREATE INDEX idx_expert_reviews_expert ON expert_reviews(expert_id);
CREATE INDEX idx_expert_reviews_status ON expert_reviews(status);
CREATE INDEX idx_client_feedback_deliverable ON client_feedback(deliverable_id);
