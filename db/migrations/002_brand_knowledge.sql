-- Brand profiles (per-tenant brand context for AI generation)
CREATE TABLE brand_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL DEFAULT 'Primary Brand',
    colors          JSONB NOT NULL DEFAULT '[]',
    fonts           JSONB NOT NULL DEFAULT '[]',
    tone_of_voice   TEXT,
    guidelines_text TEXT,
    logo_urls       TEXT[] DEFAULT '{}',
    industry        VARCHAR(100),
    target_audience TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, name)
);

-- Brand assets (uploaded reference files per brand)
CREATE TABLE brand_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_profile_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    file_name       VARCHAR(255) NOT NULL,
    file_type       VARCHAR(50) NOT NULL,
    file_url        TEXT NOT NULL,
    file_size_bytes BIGINT,
    category        VARCHAR(50),
    embedding_id    VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_brand_profiles_tenant ON brand_profiles(tenant_id);
CREATE INDEX idx_brand_assets_profile ON brand_assets(brand_profile_id);
