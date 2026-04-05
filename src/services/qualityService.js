const { query } = require('../../db/connection');
const { ValidationError } = require('../utils/errors');

const SOURCES = new Set(['automated', 'expert', 'client']);
const WEIGHTS = { automated: 0.2, expert: 0.5, client: 0.3 };

function computeOverall(automatedScore, expertScore, clientScore) {
  let sumW = 0;
  let sum = 0;
  if (automatedScore != null) {
    sum += WEIGHTS.automated * Number(automatedScore);
    sumW += WEIGHTS.automated;
  }
  if (expertScore != null) {
    sum += WEIGHTS.expert * Number(expertScore);
    sumW += WEIGHTS.expert;
  }
  if (clientScore != null) {
    sum += WEIGHTS.client * Number(clientScore);
    sumW += WEIGHTS.client;
  }
  if (sumW === 0) {
    return null;
  }
  return Math.round((sum / sumW) * 100) / 100;
}

async function recordQualityScore(projectId, score, source) {
  if (!SOURCES.has(source)) {
    throw new ValidationError('source must be automated, expert, or client');
  }
  if (score == null || Number.isNaN(Number(score))) {
    throw new ValidationError('score is required');
  }
  const { rows } = await query(
    `INSERT INTO project_quality_scores (project_id, score, source)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [projectId, score, source],
  );
  return rows[0];
}

async function getProjectQuality(projectId) {
  const { rows } = await query(
    `SELECT DISTINCT ON (source) source, score
     FROM project_quality_scores
     WHERE project_id = $1
     ORDER BY source, created_at DESC`,
    [projectId],
  );
  const bySource = { automated: null, expert: null, client: null };
  for (const r of rows) {
    bySource[r.source] = r.score != null ? Number(r.score) : null;
  }
  const overallScore = computeOverall(
    bySource.automated,
    bySource.expert,
    bySource.client,
  );
  return {
    automatedScore: bySource.automated,
    expertScore: bySource.expert,
    clientScore: bySource.client,
    overallScore,
  };
}

async function getExpertPerformance(expertId, { startDate, endDate }) {
  const params = [expertId];
  let cond = `er.expert_id = $1 AND er.completed_at IS NOT NULL`;
  let i = 2;
  if (startDate) {
    cond += ` AND er.completed_at >= $${i}::timestamptz`;
    params.push(startDate);
    i += 1;
  }
  if (endDate) {
    cond += ` AND er.completed_at <= $${i}::timestamptz`;
    params.push(endDate);
    i += 1;
  }
  const { rows } = await query(
    `SELECT
       COUNT(*)::int AS total_reviews,
       AVG(er.quality_score)::numeric AS avg_quality_score,
       AVG(er.time_spent_mins)::numeric AS avg_time_spent_mins,
       COUNT(*) FILTER (WHERE er.status = 'approved')::int AS approved_count,
       COUNT(*) FILTER (WHERE er.status = 'needs_revision')::int AS revision_count,
       COUNT(*) FILTER (WHERE er.completed_at IS NOT NULL)::int AS completed_count
     FROM expert_reviews er
     WHERE ${cond}`,
    params,
  );
  const r = rows[0];
  const completed = Number(r.completed_count) || 0;
  const approvalRate = completed > 0 ? r.approved_count / completed : null;
  const revisionRate = completed > 0 ? r.revision_count / completed : null;
  return {
    totalReviews: r.total_reviews,
    avgQualityScore: r.avg_quality_score != null ? Number(r.avg_quality_score) : null,
    avgTimeSpentMins: r.avg_time_spent_mins != null ? Number(r.avg_time_spent_mins) : null,
    approvalRate,
    revisionRate,
  };
}

function mapGroupBy(groupBy) {
  const g = String(groupBy || 'day').toLowerCase();
  if (g === 'day') {
    return 'day';
  }
  if (g === 'week') {
    return 'week';
  }
  if (g === 'month') {
    return 'month';
  }
  throw new ValidationError('groupBy must be day, week, or month');
}

async function getQualityTrends({ tenantId, startDate, endDate, groupBy }) {
  const trunc = mapGroupBy(groupBy);
  const params = [];
  let cond = '1=1';
  let i = 1;
  if (tenantId) {
    cond += ` AND p.tenant_id = $${i}`;
    params.push(tenantId);
    i += 1;
  }
  if (startDate) {
    cond += ` AND pqs.created_at >= $${i}::timestamptz`;
    params.push(startDate);
    i += 1;
  }
  if (endDate) {
    cond += ` AND pqs.created_at <= $${i}::timestamptz`;
    params.push(endDate);
    i += 1;
  }
  const { rows } = await query(
    `SELECT
       date_trunc($${i}::text, pqs.created_at) AS period,
       AVG(pqs.score)::numeric AS avg_score,
       COUNT(DISTINCT pqs.project_id)::int AS total_projects
     FROM project_quality_scores pqs
     JOIN projects p ON p.id = pqs.project_id
     WHERE ${cond}
     GROUP BY 1
     ORDER BY 1 ASC`,
    [...params, trunc],
  );
  return rows.map((row) => ({
    period: row.period,
    avgScore: row.avg_score != null ? Number(row.avg_score) : null,
    totalProjects: row.total_projects,
  }));
}

async function getTopExperts(limit, { tenantId } = {}) {
  const l = Math.min(100, Math.max(1, parseInt(String(limit || 10), 10) || 10));
  const { rows } = await query(
    `SELECT
      u.id AS expert_id,
      u.name,
      AVG(er.quality_score)::numeric AS avg_score,
      COUNT(er.id)::int AS total_reviews,
      (COUNT(*) FILTER (WHERE er.status = 'approved')::float
        / NULLIF(COUNT(*) FILTER (WHERE er.completed_at IS NOT NULL), 0)) AS approval_rate
    FROM users u
    INNER JOIN expert_reviews er ON er.expert_id = u.id
    ${tenantId ? 'JOIN projects p ON p.id = er.project_id' : ''}
    WHERE u.role = 'expert'
    ${tenantId ? 'AND p.tenant_id = $2' : ''}
    AND er.completed_at IS NOT NULL
    GROUP BY u.id, u.name
    HAVING COUNT(er.id) > 0
    ORDER BY AVG(er.quality_score) DESC NULLS LAST, COUNT(er.id) DESC
    LIMIT $1`,
    tenantId ? [l, tenantId] : [l],
  );
  return rows.map((row) => ({
    expertId: row.expert_id,
    name: row.name,
    avgScore: row.avg_score != null ? Number(row.avg_score) : null,
    totalReviews: row.total_reviews,
    approvalRate: row.approval_rate != null ? Number(row.approval_rate) : null,
  }));
}

module.exports = {
  recordQualityScore,
  getProjectQuality,
  getExpertPerformance,
  getQualityTrends,
  getTopExperts,
};
