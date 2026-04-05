const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const FEEDBACK_TYPES = new Set(['comment', 'approval', 'revision_request', 'rejection']);

async function addFeedback(projectId, deliverableId, userId, { comment, feedbackType, metadata }) {
  if (!comment || typeof comment !== 'string') {
    throw new ValidationError('comment is required');
  }
  const ft = feedbackType || 'comment';
  if (!FEEDBACK_TYPES.has(ft)) {
    throw new ValidationError('Invalid feedbackType');
  }
  const meta = metadata && typeof metadata === 'object' ? JSON.stringify(metadata) : '{}';
  const { rows } = await query(
    `INSERT INTO client_feedback (project_id, deliverable_id, user_id, comment, feedback_type, metadata)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     RETURNING *`,
    [projectId, deliverableId, userId, comment, ft, meta],
  );
  return rows[0];
}

async function getFeedback(feedbackId) {
  const { rows } = await query(
    `SELECT cf.*, u.name AS user_name
     FROM client_feedback cf
     JOIN users u ON u.id = cf.user_id
     WHERE cf.id = $1`,
    [feedbackId],
  );
  if (rows.length === 0) {
    throw new NotFoundError('Feedback not found');
  }
  return rows[0];
}

async function listFeedbackForDeliverable(deliverableId) {
  const { rows } = await query(
    `SELECT cf.*, u.name AS user_name
     FROM client_feedback cf
     JOIN users u ON u.id = cf.user_id
     WHERE cf.deliverable_id = $1
     ORDER BY cf.created_at ASC`,
    [deliverableId],
  );
  return rows;
}

async function listFeedbackForProject(projectId) {
  const { rows } = await query(
    `SELECT cf.*, u.name AS user_name
     FROM client_feedback cf
     JOIN users u ON u.id = cf.user_id
     WHERE cf.project_id = $1
     ORDER BY cf.created_at ASC`,
    [projectId],
  );
  return rows;
}

async function getRevisionRequests(projectId) {
  const { rows } = await query(
    `SELECT cf.*, u.name AS user_name
     FROM client_feedback cf
     JOIN users u ON u.id = cf.user_id
     WHERE cf.project_id = $1 AND cf.feedback_type = 'revision_request'
     ORDER BY cf.created_at ASC`,
    [projectId],
  );
  return rows;
}

async function hasClientApproved(projectId) {
  const { rows } = await query(
    `SELECT EXISTS (
       SELECT 1 FROM client_feedback
       WHERE project_id = $1 AND feedback_type = 'approval'
     ) AS ok`,
    [projectId],
  );
  return Boolean(rows[0].ok);
}

module.exports = {
  addFeedback,
  getFeedback,
  listFeedbackForDeliverable,
  listFeedbackForProject,
  getRevisionRequests,
  hasClientApproved,
};
