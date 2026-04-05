const express = require('express');

const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const deliverableService = require('../services/deliverableService');

const router = express.Router();

router.use(authenticate, tenantIsolation);

router.post('/', async (req, res, next) => {
  try {
    const result = await deliverableService.createDeliverable(req.tenantId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId/history', async (req, res, next) => {
  try {
    const result = await deliverableService.getDeliverableHistory(req.params.projectId, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const result = await deliverableService.listDeliverables(req.params.projectId, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const result = await deliverableService.updateDeliverableStatus(
      req.params.id,
      req.tenantId,
      req.body.status
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/version', async (req, res, next) => {
  try {
    const result = await deliverableService.createNewVersion(req.params.id, req.tenantId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await deliverableService.getDeliverable(req.params.id, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
