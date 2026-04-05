const express = require('express');

const { authenticate } = require('../middleware/auth');
const templateService = require('../services/templateService');

const router = express.Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.body.createdBy ?? req.user.id,
    };
    const result = await templateService.createTemplate(payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/defaults', async (req, res, next) => {
  try {
    const result = templateService.getDefaultTemplates();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/best/:projectType', async (req, res, next) => {
  try {
    const result = await templateService.findBestTemplate(req.params.projectType);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await templateService.listTemplates({
      projectType: req.query.projectType,
      isPublic: req.query.isPublic,
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await templateService.getTemplate(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await templateService.updateTemplate(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
