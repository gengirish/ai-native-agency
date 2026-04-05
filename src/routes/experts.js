const express = require('express');

const { query } = require('../../db/connection');
const { authenticate, requireRole } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const { NotFoundError, ValidationError } = require('../utils/errors');
const expertReviewService = require('../services/expertReviewService');
const qualityService = require('../services/qualityService');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);
router.use(requireRole('expert', 'admin'));

async function assertProjectInTenant(projectId, tenantId) {
  const { rows } = await query(
    `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
    [projectId, tenantId],
  );
  if (rows.length === 0) {
    throw new NotFoundError('Project not found');
  }
}

router.get('/reviews/pending', async (req, res, next) => {
  try {
    const { projectType, priority, page, limit } = req.query;
    const data = await expertReviewService.listPendingReviews({
      tenantId: req.tenantId,
      projectType: projectType || undefined,
      priority: priority || undefined,
      page,
      limit,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/reviews/mine', async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const data = await expertReviewService.listExpertReviews(req.user.id, {
      status: status || undefined,
      page,
      limit,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/reviews', async (req, res, next) => {
  try {
    const { projectId } = req.body || {};
    if (!projectId) {
      throw new ValidationError('projectId is required');
    }
    await assertProjectInTenant(projectId, req.tenantId);
    const review = await expertReviewService.createReview(projectId, req.user.id);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

router.get('/reviews/:id', async (req, res, next) => {
  try {
    const review = await expertReviewService.getReview(req.params.id);
    if (String(review.project_tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Review not found');
    }
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.post('/reviews/:id/claim', async (req, res, next) => {
  try {
    const review = await expertReviewService.getReview(req.params.id);
    if (String(review.project_tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Review not found');
    }
    const updated = await expertReviewService.claimReview(req.params.id, req.user.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/reviews/:id/approve', async (req, res, next) => {
  try {
    const review = await expertReviewService.getReview(req.params.id);
    if (String(review.project_tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Review not found');
    }
    const { qualityScore, reviewNotes, timeSpentMins } = req.body || {};
    const updated = await expertReviewService.approveReview(req.params.id, req.user.id, {
      qualityScore,
      reviewNotes,
      timeSpentMins,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/reviews/:id/revise', async (req, res, next) => {
  try {
    const review = await expertReviewService.getReview(req.params.id);
    if (String(review.project_tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Review not found');
    }
    const { reviewNotes, refinements } = req.body || {};
    const updated = await expertReviewService.requestRevision(req.params.id, req.user.id, {
      reviewNotes,
      refinements,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post('/reviews/:id/escalate', async (req, res, next) => {
  try {
    const review = await expertReviewService.getReview(req.params.id);
    if (String(review.project_tenant_id) !== String(req.tenantId) && req.user.role !== 'admin') {
      throw new NotFoundError('Review not found');
    }
    const { reviewNotes } = req.body || {};
    const result = await expertReviewService.escalateReview(req.params.id, req.user.id, {
      reviewNotes,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/workload', async (req, res, next) => {
  try {
    const count = await expertReviewService.getExpertWorkload(req.user.id);
    res.json({ inProgressCount: count });
  } catch (err) {
    next(err);
  }
});

router.post('/auto-assign', async (req, res, next) => {
  try {
    const { projectId } = req.body || {};
    if (!projectId) {
      throw new ValidationError('projectId is required');
    }
    await assertProjectInTenant(projectId, req.tenantId);
    const result = await expertReviewService.autoAssignExpert(projectId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/performance', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await qualityService.getExpertPerformance(req.user.id, {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const board = await qualityService.getTopExperts(limit, { tenantId: req.tenantId });
    res.json({ experts: board });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
