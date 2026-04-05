const express = require('express');
const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');
const pipelineOrchestrator = require('../services/pipelineOrchestrator');

const router = express.Router();

router.post('/run', async (req, res, next) => {
  try {
    const { projectId, briefId, tier } = req.body || {};
    if (!projectId || !briefId) {
      throw new ValidationError('projectId and briefId are required');
    }

    const projRes = await query(`SELECT id, tenant_id FROM projects WHERE id = $1`, [projectId]);
    if (projRes.rows.length === 0) {
      throw new NotFoundError('Project not found');
    }
    const tenantId = projRes.rows[0].tenant_id;

    const result = await pipelineOrchestrator.runPipeline(projectId, briefId, tenantId, {
      tier: tier === 'premium' || tier === 'starter' ? tier : undefined,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const runsRes = await query(
      `SELECT * FROM pipeline_runs WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId]
    );
    res.json({ runs: runsRes.rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const status = await pipelineOrchestrator.getPipelineStatus(req.params.id);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/retry', async (req, res, next) => {
  try {
    const result = await pipelineOrchestrator.retryFailedTasks(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
