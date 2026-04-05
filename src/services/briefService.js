const { query, getClient } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const BRIEF_UPDATABLE = new Set([
  'brief_type',
  'content',
  'reference_urls',
  'target_audience',
  'tone',
  'dimensions',
  'additional_notes',
]);

function assertUuid(value, fieldName = 'id') {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(value)) {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
}

async function assertProjectInTenant(projectId, tenantId) {
  const res = await query(
    `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
    [projectId, tenantId]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
}

async function createBrief(tenantId, projectId, payload) {
  assertUuid(tenantId, 'tenantId');
  assertUuid(projectId, 'projectId');
  await assertProjectInTenant(projectId, tenantId);

  const {
    briefType,
    content = {},
    referenceUrls,
    targetAudience,
    tone,
    dimensions,
    additionalNotes,
  } = payload;

  if (!briefType || typeof briefType !== 'string') {
    throw new ValidationError('briefType is required');
  }

  const contentJson = typeof content === 'object' && content !== null ? content : {};
  const refUrls = Array.isArray(referenceUrls) ? referenceUrls : referenceUrls == null ? [] : [];

  const res = await query(
    `INSERT INTO briefs (
        project_id, tenant_id, brief_type, content, reference_urls,
        target_audience, tone, dimensions, additional_notes
      )
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8::jsonb, $9)
      RETURNING *`,
    [
      projectId,
      tenantId,
      briefType,
      JSON.stringify(contentJson),
      refUrls,
      targetAudience ?? null,
      tone ?? null,
      dimensions != null ? JSON.stringify(dimensions) : null,
      additionalNotes ?? null,
    ]
  );
  return res.rows[0];
}

async function getBrief(briefId, tenantId) {
  assertUuid(briefId, 'briefId');
  assertUuid(tenantId, 'tenantId');

  const res = await query(
    `SELECT * FROM briefs WHERE id = $1 AND tenant_id = $2`,
    [briefId, tenantId]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Brief not found');
  }
  return res.rows[0];
}

async function submitBrief(briefId, tenantId) {
  assertUuid(briefId, 'briefId');
  assertUuid(tenantId, 'tenantId');

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const briefRes = await client.query(
      `SELECT id, project_id, submitted_at FROM briefs WHERE id = $1 AND tenant_id = $2 FOR UPDATE`,
      [briefId, tenantId]
    );
    if (briefRes.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new NotFoundError('Brief not found');
    }
    if (briefRes.rows[0].submitted_at != null) {
      await client.query('ROLLBACK');
      throw new ValidationError('Brief already submitted');
    }

    const projectId = briefRes.rows[0].project_id;

    const updBrief = await client.query(
      `UPDATE briefs SET submitted_at = now(), updated_at = now()
       WHERE id = $1 AND tenant_id = $2
       RETURNING *`,
      [briefId, tenantId]
    );

    await client.query(
      `UPDATE projects SET status = 'submitted', updated_at = now()
       WHERE id = $1 AND tenant_id = $2`,
      [projectId, tenantId]
    );

    await client.query('COMMIT');
    return updBrief.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateBrief(briefId, tenantId, updates) {
  assertUuid(briefId, 'briefId');
  assertUuid(tenantId, 'tenantId');

  if (!updates || typeof updates !== 'object') {
    throw new ValidationError('updates object is required');
  }

  const keys = Object.keys(updates).filter((k) => updates[k] !== undefined);
  const allowed = keys.filter((k) => BRIEF_UPDATABLE.has(k));
  if (allowed.length === 0) {
    throw new ValidationError('No valid fields to update');
  }
  const bad = keys.filter((k) => !BRIEF_UPDATABLE.has(k));
  if (bad.length > 0) {
    throw new ValidationError(`Cannot update fields: ${bad.join(', ')}`);
  }

  const setParts = [];
  const values = [];
  let i = 1;

  for (const key of allowed) {
    let val = updates[key];
    if (key === 'content' || key === 'dimensions') {
      if (val !== null && typeof val !== 'object') {
        throw new ValidationError(`${key} must be an object`);
      }
      val = val == null ? null : JSON.stringify(val);
      setParts.push(`${key} = $${i}::jsonb`);
    } else if (key === 'reference_urls') {
      if (!Array.isArray(val)) {
        throw new ValidationError('reference_urls must be an array');
      }
      setParts.push(`${key} = $${i}`);
    } else {
      setParts.push(`${key} = $${i}`);
    }
    values.push(val);
    i += 1;
  }

  setParts.push('updated_at = now()');
  values.push(briefId, tenantId);

  const res = await query(
    `UPDATE briefs SET ${setParts.join(', ')}
     WHERE id = $${i} AND tenant_id = $${i + 1}
     RETURNING *`,
    values
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Brief not found');
  }
  return res.rows[0];
}

module.exports = {
  createBrief,
  getBrief,
  submitBrief,
  updateBrief,
};
