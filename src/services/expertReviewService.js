const { query, getClient } = require('../../db/connection');
const { ValidationError, NotFoundError, ForbiddenError, ConflictError } = require('../utils/errors');

const PRIORITY_ORDER_SQL = `
  CASE p.priority
    WHEN 'urgent' THEN 4
    WHEN 'high' THEN 3
    WHEN 'normal' THEN 2
    WHEN 'low' THEN 1
    ELSE 0
  END
`;

function normalizePagination(page, limit) {
  const p = Math.max(1, parseInt(String(page || 1), 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(String(limit || 20), 10) || 20));
  return { page: p, limit: l, offset: (p - 1) * l };
}

async function createReview(projectId, expertId) {
  const { rows } = await query(
    `INSERT INTO expert_reviews (project_id, expert_id, status)
     VALUES ($1, $2, 'pending')
     RETURNING *`,
    [projectId, expertId],
  );
  return rows[0];
}

async function claimReview(reviewId, expertId) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const lock = await client.query(
      `SELECT id, expert_id, status FROM expert_reviews WHERE id = $1 FOR UPDATE`,
      [reviewId],
    );
    if (lock.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new NotFoundError('Review not found');
    }
    const row = lock.rows[0];
    if (row.status === 'in_progress' && row.expert_id !== expertId) {
      await client.query('ROLLBACK');
      throw new ConflictError('Review already claimed by another expert');
    }
    if (row.status !== 'pending' && row.status !== 'in_progress') {
      await client.query('ROLLBACK');
      throw new ConflictError('Review is not available to claim');
    }
    if (row.status === 'pending' && row.expert_id !== expertId) {
      await client.query('ROLLBACK');
      throw new ForbiddenError('This review is assigned to another expert');
    }
    if (row.status === 'in_progress' && row.expert_id === expertId) {
      await client.query('COMMIT');
      const full = await query(
        `SELECT er.*, p.title AS project_title, p.status AS project_status, p.project_type, p.priority
         FROM expert_reviews er
         JOIN projects p ON p.id = er.project_id
         WHERE er.id = $1`,
        [reviewId],
      );
      return full.rows[0];
    }
    const { rows } = await client.query(
      `UPDATE expert_reviews
       SET status = 'in_progress', claimed_at = now()
       WHERE id = $1
       RETURNING *`,
      [reviewId],
    );
    await client.query('COMMIT');
    const joined = await query(
      `SELECT er.*, p.title AS project_title, p.status AS project_status, p.project_type, p.priority
       FROM expert_reviews er
       JOIN projects p ON p.id = er.project_id
       WHERE er.id = $1`,
      [reviewId],
    );
    return joined.rows[0] || rows[0];
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

async function getReview(reviewId) {
  const { rows } = await query(
    `SELECT er.*,
            p.title AS project_title,
            p.status AS project_status,
            p.project_type,
            p.priority,
            p.tenant_id AS project_tenant_id,
            u.name AS expert_name,
            u.email AS expert_email,
            u.specialties AS expert_specialties
     FROM expert_reviews er
     JOIN projects p ON p.id = er.project_id
     JOIN users u ON u.id = er.expert_id
     WHERE er.id = $1`,
    [reviewId],
  );
  if (rows.length === 0) {
    throw new NotFoundError('Review not found');
  }
  return rows[0];
}

async function listPendingReviews({ tenantId, projectType, priority, page, limit }) {
  const { page: p, limit: l, offset } = normalizePagination(page, limit);
  const conditions = [`er.status = 'pending'`, `p.tenant_id = $1`];
  const params = [tenantId];
  let i = 2;
  if (projectType) {
    conditions.push(`p.project_type = $${i}`);
    params.push(projectType);
    i += 1;
  }
  if (priority) {
    conditions.push(`p.priority = $${i}`);
    params.push(priority);
    i += 1;
  }
  const where = conditions.join(' AND ');
  const countRes = await query(
    `SELECT COUNT(*)::int AS c
     FROM expert_reviews er
     JOIN projects p ON p.id = er.project_id
     WHERE ${where}`,
    params,
  );
  const total = countRes.rows[0].c;
  const listParams = [...params, l, offset];
  const { rows } = await query(
    `SELECT er.*,
            p.title AS project_title,
            p.project_type,
            p.priority,
            p.status AS project_status
     FROM expert_reviews er
     JOIN projects p ON p.id = er.project_id
     WHERE ${where}
     ORDER BY ${PRIORITY_ORDER_SQL} DESC, er.created_at ASC
     LIMIT $${i} OFFSET $${i + 1}`,
    listParams,
  );
  return { items: rows, total, page: p, limit: l };
}

async function listExpertReviews(expertId, { status, page, limit }) {
  const { page: p, limit: l, offset } = normalizePagination(page, limit);
  const conditions = [`er.expert_id = $1`];
  const params = [expertId];
  let i = 2;
  if (status) {
    conditions.push(`er.status = $${i}`);
    params.push(status);
    i += 1;
  }
  const where = conditions.join(' AND ');
  const countRes = await query(
    `SELECT COUNT(*)::int AS c FROM expert_reviews er WHERE ${where}`,
    params,
  );
  const total = countRes.rows[0].c;
  const listParams = [...params, l, offset];
  const { rows } = await query(
    `SELECT er.*,
            p.title AS project_title,
            p.project_type,
            p.priority,
            p.status AS project_status
     FROM expert_reviews er
     JOIN projects p ON p.id = er.project_id
     WHERE ${where}
     ORDER BY er.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`,
    listParams,
  );
  return { items: rows, total, page: p, limit: l };
}

async function approveReview(reviewId, expertId, { qualityScore, reviewNotes, timeSpentMins }) {
  if (qualityScore == null || Number.isNaN(Number(qualityScore))) {
    throw new ValidationError('qualityScore is required');
  }
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `SELECT er.id, er.expert_id, er.status, er.project_id
       FROM expert_reviews er
       WHERE er.id = $1
       FOR UPDATE`,
      [reviewId],
    );
    if (r.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new NotFoundError('Review not found');
    }
    const row = r.rows[0];
    if (row.expert_id !== expertId) {
      await client.query('ROLLBACK');
      throw new ForbiddenError('Not your review');
    }
    if (row.status !== 'in_progress' && row.status !== 'pending') {
      await client.query('ROLLBACK');
      throw new ValidationError('Review cannot be approved in its current state');
    }
    await client.query(
      `UPDATE expert_reviews
       SET status = 'approved',
           completed_at = now(),
           quality_score = $2,
           review_notes = $3,
           time_spent_mins = $4
       WHERE id = $1`,
      [reviewId, qualityScore, reviewNotes ?? null, timeSpentMins ?? null],
    );
    await client.query(
      `UPDATE projects SET status = 'approved', quality_score = $2, updated_at = now() WHERE id = $1`,
      [row.project_id, qualityScore],
    );
    await client.query(
      `INSERT INTO project_quality_scores (project_id, score, source) VALUES ($1, $2, 'expert')`,
      [row.project_id, qualityScore],
    );
    await client.query('COMMIT');
    return getReview(reviewId);
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

async function requestRevision(reviewId, expertId, { reviewNotes, refinements }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `SELECT er.id, er.expert_id, er.status, er.project_id
       FROM expert_reviews er
       WHERE er.id = $1
       FOR UPDATE`,
      [reviewId],
    );
    if (r.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new NotFoundError('Review not found');
    }
    const row = r.rows[0];
    if (row.expert_id !== expertId) {
      await client.query('ROLLBACK');
      throw new ForbiddenError('Not your review');
    }
    if (row.status !== 'in_progress' && row.status !== 'pending') {
      await client.query('ROLLBACK');
      throw new ValidationError('Review cannot be revised in its current state');
    }
    const ref = Array.isArray(refinements) ? JSON.stringify(refinements) : JSON.stringify([]);
    await client.query(
      `UPDATE expert_reviews
       SET status = 'needs_revision',
           review_notes = $2,
           refinements = $3::jsonb,
           completed_at = now()
       WHERE id = $1`,
      [reviewId, reviewNotes ?? null, ref],
    );
    await client.query(
      `UPDATE projects SET status = 'revision_requested', updated_at = now() WHERE id = $1`,
      [row.project_id],
    );
    await client.query('COMMIT');
    return getReview(reviewId);
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

async function escalateReview(reviewId, expertId, { reviewNotes }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `SELECT er.id, er.expert_id, er.status, er.project_id
       FROM expert_reviews er
       JOIN projects p ON p.id = er.project_id
       WHERE er.id = $1
       FOR UPDATE OF er`,
      [reviewId],
    );
    if (r.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new NotFoundError('Review not found');
    }
    const row = r.rows[0];
    if (row.expert_id !== expertId) {
      await client.query('ROLLBACK');
      throw new ForbiddenError('Not your review');
    }
    const tenantRes = await client.query(`SELECT tenant_id FROM projects WHERE id = $1`, [row.project_id]);
    const tenantId = tenantRes.rows[0].tenant_id;
    const senior = await client.query(
      `SELECT id FROM users
       WHERE role = 'expert'
         AND status = 'active'
         AND COALESCE(specialties, '{}') @> ARRAY['senior']::text[]
         AND (tenant_id = $1 OR tenant_id IS NULL)
         AND id <> $2
       ORDER BY id
       LIMIT 1`,
      [tenantId, expertId],
    );
    if (senior.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new ValidationError('No senior expert available for escalation');
    }
    const seniorId = senior.rows[0].id;
    await client.query(
      `UPDATE expert_reviews
       SET status = 'escalated', review_notes = COALESCE($2, review_notes), completed_at = now()
       WHERE id = $1`,
      [reviewId, reviewNotes ?? null],
    );
    const ins = await client.query(
      `INSERT INTO expert_reviews (project_id, expert_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [row.project_id, seniorId],
    );
    await client.query('COMMIT');
    return { escalatedReview: await getReview(reviewId), newReview: ins.rows[0] };
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

async function getExpertWorkload(expertId) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS c
     FROM expert_reviews
     WHERE expert_id = $1 AND status = 'in_progress'`,
    [expertId],
  );
  return rows[0].c;
}

async function autoAssignExpert(projectId) {
  const pRes = await query(
    `SELECT id, project_type, tenant_id FROM projects WHERE id = $1`,
    [projectId],
  );
  if (pRes.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
  const { project_type: projectType, tenant_id: tenantId } = pRes.rows[0];
  const { rows } = await query(
    `SELECT u.id,
            COUNT(er.id) FILTER (WHERE er.status = 'in_progress')::int AS workload
     FROM users u
     LEFT JOIN expert_reviews er ON er.expert_id = u.id
     WHERE u.role = 'expert'
       AND u.status = 'active'
       AND (u.tenant_id = $1 OR u.tenant_id IS NULL)
       AND ($2 = ANY (COALESCE(u.specialties, '{}')))
     GROUP BY u.id
     ORDER BY workload ASC, u.id ASC
     LIMIT 1`,
    [tenantId, projectType],
  );
  if (rows.length === 0) {
    throw new ValidationError('No expert found matching project specialty');
  }
  const expertId = rows[0].id;
  const review = await createReview(projectId, expertId);
  await query(`UPDATE projects SET assigned_expert = $2, updated_at = now() WHERE id = $1`, [
    projectId,
    expertId,
  ]);
  return { expertId, review };
}

module.exports = {
  createReview,
  claimReview,
  getReview,
  listPendingReviews,
  listExpertReviews,
  approveReview,
  requestRevision,
  escalateReview,
  getExpertWorkload,
  autoAssignExpert,
};
