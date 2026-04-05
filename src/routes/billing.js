const express = require('express');
const router = express.Router();
const billingService = require('../services/billingService');
const { ValidationError, ForbiddenError } = require('../utils/errors');

function requireTenant(req, res, next) {
  if (!req.tenantId) {
    return next(new ValidationError('Tenant context required'));
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
}

router.use(requireTenant);

router.get('/balance', async (req, res, next) => {
  try {
    const balance = await billingService.getBalance(req.tenantId);
    res.json(balance);
  } catch (err) {
    next(err);
  }
});

router.post('/balance/initialize', requireAdmin, async (req, res, next) => {
  try {
    const { plan, creditsTotal } = req.body || {};
    const row = await billingService.initializeBalance(req.tenantId, plan, creditsTotal);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/credits/add', requireAdmin, async (req, res, next) => {
  try {
    const { amount } = req.body || {};
    const row = await billingService.addCredits(req.tenantId, amount);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/invoices', async (req, res, next) => {
  try {
    const { amountCents, lineItems, dueDate } = req.body || {};
    const invoice = await billingService.createInvoice(req.tenantId, {
      amountCents,
      lineItems,
      dueDate,
    });
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
});

router.get('/invoices', async (req, res, next) => {
  try {
    const result = await billingService.listInvoices(req.tenantId, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/invoices/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const invoice = await billingService.updateInvoiceStatus(
      req.params.id,
      req.tenantId,
      status
    );
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
