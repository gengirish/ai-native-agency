const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');
const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');

router.use(authenticate, tenantIsolation);

router.get('/stats', async (req, res, next) => {
  try {
    const result = await projectService.getProjectStats(req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      projectType,
      brandProfileId,
      createdBy,
      priority,
      dueDate,
      priceCents,
    } = req.body || {};
    const project = await projectService.createProject(req.tenantId, {
      title,
      projectType,
      brandProfileId,
      createdBy,
      priority,
      dueDate,
      priceCents,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await projectService.listProjects(req.tenantId, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id, req.tenantId);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const project = await projectService.updateProjectStatus(
      req.params.id,
      req.tenantId,
      status
    );
    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/assign', async (req, res, next) => {
  try {
    const { expertId } = req.body || {};
    const project = await projectService.assignExpert(req.params.id, req.tenantId, expertId);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
