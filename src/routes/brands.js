const express = require('express');

const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const brandService = require('../services/brandService');

const router = express.Router();

router.use(authenticate, tenantIsolation);

router.post('/extract', async (req, res, next) => {
  try {
    const result = await brandService.extractBrandFromUrl(req.body?.url);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const result = await brandService.createBrandProfile(req.tenantId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await brandService.listBrandProfiles(req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/context', async (req, res, next) => {
  try {
    const result = await brandService.getBrandContext(req.params.id, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/assets', async (req, res, next) => {
  try {
    const result = await brandService.listBrandAssets(req.params.id, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/assets/:assetId', async (req, res, next) => {
  try {
    const result = await brandService.deleteBrandAsset(req.params.assetId, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/assets', async (req, res, next) => {
  try {
    const result = await brandService.addBrandAsset(req.params.id, req.tenantId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await brandService.getBrandProfile(req.params.id, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const result = await brandService.updateBrandProfile(req.params.id, req.tenantId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await brandService.deleteBrandProfile(req.params.id, req.tenantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
