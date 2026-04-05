const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const PROJECT_STATUSES = new Set([
  'draft',
  'submitted',
  'processing',
  'in_review',
  'revision_requested',
  'approved',
  'delivered',
  'cancelled',
]);

const PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);

function assertUuid(value, fieldName = 'id') {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(value)) {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
}

async function createProject(tenantId, payload) {
  assertUuid(tenantId, 'tenantId');
  const {
    title,
    projectType,
    brandProfileId,
    createdBy,
    priority = 'normal',
    dueDate,
    priceCents = 0,
  } = payload;

  if (!title || typeof title !== 'string') {
    throw new ValidationError('title is required');
  }
  if (!projectType || typeof projectType !== 'string') {
    throw new ValidationError('projectType is required');
  }
  if (!createdBy) {
    throw new ValidationError('createdBy is required');
  }
  assertUuid(createdBy, 'createdBy');
  if (!PRIORITIES.has(priority)) {
    throw new ValidationError('Invalid priority');
  }
  if (brandProfileId != null) {
    assertUuid(brandProfileId, 'brandProfileId');
  }

  const due = dueDate != null ? new Date(dueDate) : null;
  if (dueDate != null && Number.isNaN(due.getTime())) {
    throw new ValidationError('Invalid dueDate');
  }
  if (typeof priceCents !== 'number' || !Number.isInteger(priceCents) || priceCents < 0) {
    throw new ValidationError('priceCents must be a non-negative integer');
  }

  const res = await query(
    `INSERT INTO projects (
        tenant_id, title, project_type, brand_profile_id, created_by,
        priority, due_date, price_cents, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
      RETURNING *`,
    [tenantId, title, projectType, brandProfileId || null, createdBy, priority, due, priceCents]
  );
  return res.rows[0];
}

async function getProject(projectId, tenantId) {
  assertUuid(projectId, 'projectId');
  assertUuid(tenantId, 'tenantId');

  const res = await query(
    `SELECT
        p.*,
        CASE WHEN p.brand_profile_id IS NULL THEN NULL ELSE to_jsonb(bp.*) END AS brand_profile,
        CASE WHEN p.assigned_expert IS NULL THEN NULL ELSE to_jsonb(e.*) END AS assigned_expert
      FROM projects p
      LEFT JOIN brand_profiles bp ON bp.id = p.brand_profile_id
      LEFT JOIN users e ON e.id = p.assigned_expert
      WHERE p.id = $1 AND p.tenant_id = $2`,
    [projectId, tenantId]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
  return res.rows[0];
}

async function listProjects(tenantId, options = {}) {
  assertUuid(tenantId, 'tenantId');
  const status = options.status;
  const page = Math.max(1, parseInt(String(options.page || 1), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(options.limit || 20), 10) || 20));
  const offset = (page - 1) * limit;

  if (status != null && status !== '' && !PROJECT_STATUSES.has(String(status))) {
    throw new ValidationError('Invalid status filter');
  }

  const params = [tenantId];
  let where = 'WHERE p.tenant_id = $1';
  if (status != null && status !== '') {
    params.push(String(status));
    where += ` AND p.status = $${params.length}`;
  }

  const countRes = await query(`SELECT COUNT(*)::int AS total FROM projects p ${where}`, params);
  const total = countRes.rows[0].total;

  const listParams = [...params, limit, offset];
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;
  const listRes = await query(
    `SELECT p.* FROM projects p ${where}
     ORDER BY p.created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    listParams
  );

  return {
    projects: listRes.rows,
    total,
    page,
    limit,
  };
}

async function updateProjectStatus(projectId, tenantId, status) {
  assertUuid(projectId, 'projectId');
  assertUuid(tenantId, 'tenantId');
  if (!PROJECT_STATUSES.has(String(status))) {
    throw new ValidationError('Invalid status');
  }

  const res = await query(
    `UPDATE projects
     SET status = $3, updated_at = now()
     WHERE id = $1 AND tenant_id = $2
     RETURNING *`,
    [projectId, tenantId, String(status)]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
  return res.rows[0];
}

async function assignExpert(projectId, tenantId, expertId) {
  assertUuid(projectId, 'projectId');
  assertUuid(tenantId, 'tenantId');
  assertUuid(expertId, 'expertId');

  const userRes = await query(
    `SELECT id, role FROM users WHERE id = $1 AND tenant_id = $2 AND status = 'active'`,
    [expertId, tenantId]
  );
  if (userRes.rows.length === 0) {
    throw new ValidationError('Expert not found in this tenant');
  }
  const role = userRes.rows[0].role;
  if (role !== 'expert' && role !== 'admin') {
    throw new ValidationError('User cannot be assigned as expert');
  }

  const res = await query(
    `UPDATE projects
     SET assigned_expert = $3, updated_at = now()
     WHERE id = $1 AND tenant_id = $2
     RETURNING *`,
    [projectId, tenantId, expertId]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
  return res.rows[0];
}

async function getProjectStats(tenantId) {
  assertUuid(tenantId, 'tenantId');

  const totalRes = await query(
    `SELECT COUNT(*)::int AS total FROM projects WHERE tenant_id = $1`,
    [tenantId]
  );
  const total = totalRes.rows[0].total;

  const byStatusRes = await query(
    `SELECT status, COUNT(*)::int AS count
     FROM projects
     WHERE tenant_id = $1
     GROUP BY status
     ORDER BY status`,
    [tenantId]
  );
  const byStatus = {};
  for (const row of byStatusRes.rows) {
    byStatus[row.status] = row.count;
  }

  const avgRes = await query(
    `SELECT
       AVG(EXTRACT(EPOCH FROM (delivered_at - created_at)))::float AS avg_completion_seconds
     FROM projects
     WHERE tenant_id = $1
       AND delivered_at IS NOT NULL`,
    [tenantId]
  );
  const avgCompletionSeconds = avgRes.rows[0].avg_completion_seconds;

  const revenueRes = await query(
    `SELECT COALESCE(SUM(price_cents), 0)::bigint AS total_revenue_cents
     FROM projects
     WHERE tenant_id = $1
       AND status = 'delivered'`,
    [tenantId]
  );
  const totalRevenueCents = Number(revenueRes.rows[0].total_revenue_cents);

  return {
    totalProjects: total,
    byStatus,
    avgCompletionSeconds: avgCompletionSeconds != null ? avgCompletionSeconds : null,
    totalRevenueCents,
  };
}

module.exports = {
  createProject,
  getProject,
  listProjects,
  updateProjectStatus,
  assignExpert,
  getProjectStats,
};
