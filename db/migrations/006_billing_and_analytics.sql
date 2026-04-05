-- Billing: credit packs, invoices, usage tracking
CREATE TABLE credit_balances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    credits_total   INTEGER NOT NULL DEFAULT 0,
    credits_used    INTEGER NOT NULL DEFAULT 0,
    plan            VARCHAR(50) NOT NULL DEFAULT 'starter',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id)
);

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255),
    amount_cents    INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
    line_items      JSONB NOT NULL DEFAULT '[]',
    issued_at       TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,
    due_date        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI cost log (every API call tracked for margin analysis)
CREATE TABLE ai_cost_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_task_id UUID REFERENCES pipeline_tasks(id),
    project_id      UUID REFERENCES projects(id),
    tenant_id       UUID REFERENCES tenants(id),
    model_provider  VARCHAR(50) NOT NULL,
    model_name      VARCHAR(100) NOT NULL,
    input_tokens    INTEGER NOT NULL DEFAULT 0,
    output_tokens   INTEGER NOT NULL DEFAULT 0,
    cost_cents      INTEGER NOT NULL DEFAULT 0,
    latency_ms      INTEGER,
    request_type    VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates (reusable project templates)
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    project_type    VARCHAR(50) NOT NULL,
    brief_template  JSONB NOT NULL DEFAULT '{}',
    pipeline_config JSONB NOT NULL DEFAULT '{}',
    prompt_templates JSONB NOT NULL DEFAULT '{}',
    usage_count     INTEGER NOT NULL DEFAULT 0,
    avg_quality_score NUMERIC(3,2),
    is_public       BOOLEAN NOT NULL DEFAULT false,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_balances_tenant ON credit_balances(tenant_id);
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_ai_cost_log_project ON ai_cost_log(project_id);
CREATE INDEX idx_ai_cost_log_tenant ON ai_cost_log(tenant_id);
CREATE INDEX idx_ai_cost_log_created ON ai_cost_log(created_at);
CREATE INDEX idx_templates_type ON templates(project_type);
