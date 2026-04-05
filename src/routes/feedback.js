const express = require('express');

const { query } = require('../../db/connection');
const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const { NotFoundError, ValidationError } = require('../utils/errors');
const clientFeedbackService = require('../services/clientFeedbackService');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

async function assertDeliverableOnProject(deliverableId, projectId, tenantId) {
  const { rows } = await query(
    `SELECT id FROM deliverables
     WHERE id = $1 AND project_id = $2 AND tenant_id = $3`,
    [deliverableId, projectId, tenantId],
  );
  if (rows.length === 0) {
    throw new NotFoundError('Deliverable not found for this project');
  }
}

router.post('/', async (req, res, next) => {
  try {
    const { projectId, deliverableId, comment, feedbackType, metadata } = req.body || {};
    if (!projectId || !deliverableId) {
      throw new ValidationError('projectId and deliverableId are required');
    }
    await assertDeliverableOnProject(deliverableId, projectId, req.tenantId);
    const row = await clientFeedbackService.addFeedback(projectId, deliverableId, req.user.id, {
      comment,
      feedbackType,
      metadata,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
});

router.get('/deliverable/:deliverableId', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT d.tenant_id FROM deliverables d WHERE d.id = $1`,
      [req.params.deliverableId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Deliverable not found');
    }
    if (String(rows[0].tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Deliverable not found');
    }
    const list = await clientFeedbackService.listFeedbackForDeliverable(req.params.deliverableId);
    res.json({ items: list });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [req.params.projectId, req.tenantId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Project not found');
    }
    const list = await clientFeedbackService.listFeedbackForProject(req.params.projectId);
    res.json({ items: list });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId/revisions', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [req.params.projectId, req.tenantId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Project not found');
    }
    const list = await clientFeedbackService.getRevisionRequests(req.params.projectId);
    res.json({ items: list });
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId/approved', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [req.params.projectId, req.tenantId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Project not found');
    }
    const approved = await clientFeedbackService.hasClientApproved(req.params.projectId);
    res.json({ approved });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
