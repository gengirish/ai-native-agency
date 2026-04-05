-- Per-source quality scores for weighted analytics (automated / expert / client)
CREATE TABLE project_quality_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    score           NUMERIC(3,2) NOT NULL,
    source          VARCHAR(20) NOT NULL
                    CHECK (source IN ('automated','expert','client')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_quality_scores_project ON project_quality_scores(project_id);
CREATE INDEX idx_project_quality_scores_project_source_created
    ON project_quality_scores(project_id, source, created_at DESC);
