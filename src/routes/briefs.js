const express = require('express');
const router = express.Router();
const briefService = require('../services/briefService');
const { ValidationError } = require('../utils/errors');

const BRIEF_CAMEL_TO_SNAKE = {
  briefType: 'brief_type',
  referenceUrls: 'reference_urls',
  targetAudience: 'target_audience',
  additionalNotes: 'additional_notes',
};

function mapBriefUpdates(body) {
  const out = {};
  for (const [key, val] of Object.entries(body || {})) {
    const snake = BRIEF_CAMEL_TO_SNAKE[key] || key;
    out[snake] = val;
  }
  return out;
}

function requireTenant(req, res, next) {
  if (!req.tenantId) {
    return next(new ValidationError('Tenant context required'));
  }
  next();
}

router.use(requireTenant);

router.post('/', async (req, res, next) => {
  try {
    const {
      projectId,
      briefType,
      content,
      referenceUrls,
      targetAudience,
      tone,
      dimensions,
      additionalNotes,
    } = req.body || {};
    const brief = await briefService.createBrief(req.tenantId, projectId, {
      briefType,
      content,
      referenceUrls,
      targetAudience,
      tone,
      dimensions,
      additionalNotes,
    });
    res.status(201).json(brief);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const brief = await briefService.getBrief(req.params.id, req.tenantId);
    res.json(brief);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const brief = await briefService.updateBrief(
      req.params.id,
      req.tenantId,
      mapBriefUpdates(req.body || {})
    );
    res.json(brief);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/submit', async (req, res, next) => {
  try {
    const brief = await briefService.submitBrief(req.params.id, req.tenantId);
    res.json(brief);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
