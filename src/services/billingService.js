const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const INVOICE_STATUSES = new Set(['draft', 'sent', 'paid', 'overdue', 'cancelled']);

function assertUuid(value, fieldName = 'id') {
  if (!value || typeof value !== 'string') {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(value)) {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
}

async function getBalance(tenantId) {
  assertUuid(tenantId, 'tenantId');
  const res = await query(`SELECT * FROM credit_balances WHERE tenant_id = $1`, [tenantId]);
  if (res.rows.length === 0) {
    throw new NotFoundError('Credit balance not found');
  }
  return res.rows[0];
}

async function initializeBalance(tenantId, plan, creditsTotal) {
  assertUuid(tenantId, 'tenantId');
  if (!plan || typeof plan !== 'string') {
    throw new ValidationError('plan is required');
  }
  if (typeof creditsTotal !== 'number' || !Number.isInteger(creditsTotal) || creditsTotal < 0) {
    throw new ValidationError('creditsTotal must be a non-negative integer');
  }

  const existing = await query(`SELECT id FROM credit_balances WHERE tenant_id = $1`, [tenantId]);
  if (existing.rows.length > 0) {
    throw new ValidationError('Credit balance already exists for this tenant');
  }

  const res = await query(
    `INSERT INTO credit_balances (tenant_id, plan, credits_total, credits_used)
     VALUES ($1, $2, $3, 0)
     RETURNING *`,
    [tenantId, plan, creditsTotal]
  );
  return res.rows[0];
}

async function useCredit(tenantId) {
  assertUuid(tenantId, 'tenantId');

  const res = await query(
    `UPDATE credit_balances
     SET credits_used = credits_used + 1,
         updated_at = now()
     WHERE tenant_id = $1
       AND credits_used < credits_total
     RETURNING *`,
    [tenantId]
  );
  if (res.rows.length === 0) {
    const check = await query(
      `SELECT credits_used, credits_total FROM credit_balances WHERE tenant_id = $1`,
      [tenantId]
    );
    if (check.rows.length === 0) {
      throw new NotFoundError('Credit balance not found');
    }
    throw new ValidationError('Insufficient credits');
  }
  return res.rows[0];
}

async function addCredits(tenantId, amount) {
  assertUuid(tenantId, 'tenantId');
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
    throw new ValidationError('amount must be a positive integer');
  }

  const res = await query(
    `UPDATE credit_balances
     SET credits_total = credits_total + $2,
         updated_at = now()
     WHERE tenant_id = $1
     RETURNING *`,
    [tenantId, amount]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Credit balance not found');
  }
  return res.rows[0];
}

async function createInvoice(tenantId, payload) {
  assertUuid(tenantId, 'tenantId');
  const { amountCents, lineItems, dueDate } = payload;

  if (typeof amountCents !== 'number' || !Number.isInteger(amountCents) || amountCents < 0) {
    throw new ValidationError('amountCents must be a non-negative integer');
  }
  const items = lineItems != null ? lineItems : [];
  if (typeof items !== 'object') {
    throw new ValidationError('lineItems must be an object or array');
  }

  let due = null;
  if (dueDate != null) {
    due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) {
      throw new ValidationError('Invalid dueDate');
    }
  }

  const res = await query(
    `INSERT INTO invoices (tenant_id, amount_cents, line_items, due_date, status, issued_at)
     VALUES ($1, $2, $3::jsonb, $4, 'draft', now())
     RETURNING *`,
    [tenantId, amountCents, JSON.stringify(items), due]
  );
  return res.rows[0];
}

async function listInvoices(tenantId, options = {}) {
  assertUuid(tenantId, 'tenantId');
  const status = options.status;
  const page = Math.max(1, parseInt(String(options.page || 1), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(options.limit || 20), 10) || 20));
  const offset = (page - 1) * limit;

  if (status != null && status !== '' && !INVOICE_STATUSES.has(String(status))) {
    throw new ValidationError('Invalid status filter');
  }

  const params = [tenantId];
  let where = 'WHERE tenant_id = $1';
  if (status != null && status !== '') {
    params.push(String(status));
    where += ` AND status = $${params.length}`;
  }

  const countRes = await query(`SELECT COUNT(*)::int AS total FROM invoices ${where}`, params);
  const total = countRes.rows[0].total;

  const listParams = [...params, limit, offset];
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;

  const listRes = await query(
    `SELECT * FROM invoices ${where}
     ORDER BY created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    listParams
  );

  return {
    invoices: listRes.rows,
    total,
    page,
    limit,
  };
}

async function updateInvoiceStatus(invoiceId, tenantId, status) {
  assertUuid(invoiceId, 'invoiceId');
  assertUuid(tenantId, 'tenantId');
  if (!INVOICE_STATUSES.has(String(status))) {
    throw new ValidationError('Invalid invoice status');
  }

  const res = await query(
    `UPDATE invoices
     SET status = $3
     WHERE id = $1 AND tenant_id = $2
     RETURNING *`,
    [invoiceId, tenantId, String(status)]
  );
  if (res.rows.length === 0) {
    throw new NotFoundError('Invoice not found');
  }
  return res.rows[0];
}

module.exports = {
  getBalance,
  initializeBalance,
  useCredit,
  addCredits,
  createInvoice,
  listInvoices,
  updateInvoiceStatus,
};
