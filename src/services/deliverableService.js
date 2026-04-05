const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const ALLOWED_STATUS = new Set(['draft', 'in_review', 'approved', 'rejected', 'delivered']);

async function assertProjectInTenant(projectId, tenantId) {
  const { rows } = await query(
    `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
    [projectId, tenantId]
  );
  if (!rows[0]) {
    throw new NotFoundError('Project not found');
  }
}

async function createDeliverable(tenantId, payload) {
  const {
    projectId,
    pipelineTaskId,
    title,
    fileType,
    fileUrl,
    thumbnailUrl,
    fileSizeBytes,
    metadata = {},
  } = payload || {};

  if (!projectId || !title || !fileType || !fileUrl) {
    throw new ValidationError('projectId, title, fileType, and fileUrl are required');
  }

  await assertProjectInTenant(projectId, tenantId);

  const { rows } = await query(
    `
    INSERT INTO deliverables (
      project_id, pipeline_task_id, tenant_id, title, file_type, file_url,
      thumbnail_url, file_size_bytes, version, status, metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, 'draft', $9::jsonb)
    RETURNING *
    `,
    [
      projectId,
      pipelineTaskId ?? null,
      tenantId,
      title,
      fileType,
      fileUrl,
      thumbnailUrl ?? null,
      fileSizeBytes ?? null,
      JSON.stringify(metadata),
    ]
  );
  return rows[0];
}

async function getDeliverable(deliverableId, tenantId) {
  const { rows } = await query(
    `SELECT * FROM deliverables WHERE id = $1 AND tenant_id = $2`,
    [deliverableId, tenantId]
  );
  if (!rows[0]) {
    throw new NotFoundError('Deliverable not found');
  }
  return rows[0];
}

async function listDeliverables(projectId, tenantId) {
  await assertProjectInTenant(projectId, tenantId);
  const { rows } = await query(
    `
    SELECT * FROM deliverables
    WHERE project_id = $1 AND tenant_id = $2
    ORDER BY version DESC, created_at DESC
    `,
    [projectId, tenantId]
  );
  return rows;
}

async function updateDeliverableStatus(deliverableId, tenantId, status) {
  if (!ALLOWED_STATUS.has(status)) {
    throw new ValidationError(`status must be one of: ${[...ALLOWED_STATUS].join(', ')}`);
  }
  await getDeliverable(deliverableId, tenantId);
  const { rows } = await query(
    `UPDATE deliverables SET status = $3 WHERE id = $1 AND tenant_id = $2 RETURNING *`,
    [deliverableId, tenantId, status]
  );
  return rows[0];
}

async function createNewVersion(deliverableId, tenantId, payload) {
  const prev = await getDeliverable(deliverableId, tenantId);
  const { fileUrl, thumbnailUrl, fileSizeBytes } = payload || {};
  if (!fileUrl) {
    throw new ValidationError('fileUrl is required');
  }

  const nextVersion = (prev.version || 1) + 1;

  const { rows } = await query(
    `
    INSERT INTO deliverables (
      project_id, pipeline_task_id, tenant_id, title, file_type, file_url,
      thumbnail_url, file_size_bytes, version, status, metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)
    RETURNING *
    `,
    [
      prev.project_id,
      prev.pipeline_task_id,
      tenantId,
      prev.title,
      prev.file_type,
      fileUrl,
      thumbnailUrl ?? prev.thumbnail_url,
      fileSizeBytes ?? prev.file_size_bytes,
      nextVersion,
      prev.status,
      JSON.stringify(prev.metadata || {}),
    ]
  );
  return rows[0];
}

async function getDeliverableHistory(projectId, tenantId) {
  await assertProjectInTenant(projectId, tenantId);
  const { rows } = await query(
    `
    SELECT * FROM deliverables
    WHERE project_id = $1 AND tenant_id = $2
    ORDER BY title ASC, version ASC
    `,
    [projectId, tenantId]
  );

  const byTitle = new Map();
  for (const row of rows) {
    const key = row.title;
    if (!byTitle.has(key)) {
      byTitle.set(key, []);
    }
    byTitle.get(key).push(row);
  }

  const groups = [...byTitle.entries()].map(([title, versions]) => ({
    title,
    versions,
  }));

  return { projectId, groups };
}

module.exports = {
  createDeliverable,
  getDeliverable,
  listDeliverables,
  updateDeliverableStatus,
  createNewVersion,
  getDeliverableHistory,
};
