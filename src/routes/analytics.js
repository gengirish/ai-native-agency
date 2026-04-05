const express = require('express');

const { query } = require('../../db/connection');
const { authenticate } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');
const { NotFoundError } = require('../utils/errors');
const qualityService = require('../services/qualityService');

const router = express.Router();

router.use(authenticate);
router.use(tenantIsolation);

router.get('/quality/project/:projectId', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id FROM projects WHERE id = $1 AND tenant_id = $2`,
      [req.params.projectId, req.tenantId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Project not found');
    }
    const breakdown = await qualityService.getProjectQuality(req.params.projectId);
    res.json(breakdown);
  } catch (err) {
    next(err);
  }
});

router.get('/quality/trends', async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const trends = await qualityService.getQualityTrends({
      tenantId: req.tenantId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      groupBy: groupBy || 'day',
    });
    res.json({ trends });
  } catch (err) {
    next(err);
  }
});

router.get('/experts/performance/:expertId', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT tenant_id FROM users WHERE id = $1 AND role = 'expert'`,
      [req.params.expertId],
    );
    if (rows.length === 0) {
      throw new NotFoundError('Expert not found');
    }
    const expertTenant = rows[0].tenant_id;
    if (
      req.user.role !== 'admin' &&
      expertTenant != null &&
      String(expertTenant) !== String(req.tenantId)
    ) {
      throw new NotFoundError('Expert not found');
    }
    const { startDate, endDate } = req.query;
    const stats = await qualityService.getExpertPerformance(req.params.expertId, {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get('/experts/top', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const experts = await qualityService.getTopExperts(limit, { tenantId: req.tenantId });
    res.json({ experts });
  } catch (err) {
    next(err);
  }
});

router.get('/costs/summary', async (req, res, next) => {
  try {
    const { tenantId: headerTenant, startDate, endDate } = req.query;
    const tenant =
      req.user.role === 'admin' && headerTenant ? headerTenant : req.tenantId;
    const params = [tenant];
    let cond = 'tenant_id = $1';
    let i = 2;
    if (startDate) {
      cond += ` AND created_at >= $${i}::timestamptz`;
      params.push(startDate);
      i += 1;
    }
    if (endDate) {
      cond += ` AND created_at <= $${i}::timestamptz`;
      params.push(endDate);
      i += 1;
    }
    const totalRes = await query(
      `SELECT COALESCE(SUM(cost_cents), 0)::bigint AS total_cents,
              COUNT(DISTINCT project_id)::int AS project_count
       FROM ai_cost_log
       WHERE ${cond}`,
      params,
    );
    const byProvider = await query(
      `SELECT model_provider AS provider, COALESCE(SUM(cost_cents), 0)::bigint AS total_cents
       FROM ai_cost_log
       WHERE ${cond}
       GROUP BY model_provider
       ORDER BY total_cents DESC`,
      params,
    );
    const byModel = await query(
      `SELECT model_name AS model, COALESCE(SUM(cost_cents), 0)::bigint AS total_cents
       FROM ai_cost_log
       WHERE ${cond}
       GROUP BY model_name
       ORDER BY total_cents DESC`,
      params,
    );
    const totalCents = Number(totalRes.rows[0].total_cents);
    const projectCount = totalRes.rows[0].project_count || 0;
    const avgCostPerProjectCents =
      projectCount > 0 ? Math.round(totalCents / projectCount) : null;
    res.json({
      totalCostCents: totalCents,
      avgCostPerProjectCents,
      costByProvider: byProvider.rows,
      costByModel: byModel.rows,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/revenue/summary', async (req, res, next) => {
  try {
    const { tenantId: headerTenant, startDate, endDate } = req.query;
    const tenant =
      req.user.role === 'admin' && headerTenant ? headerTenant : req.tenantId;
    const params = [tenant];
    let cond = 'tenant_id = $1';
    let i = 2;
    if (startDate) {
      cond += ` AND created_at >= $${i}::timestamptz`;
      params.push(startDate);
      i += 1;
    }
    if (endDate) {
      cond += ` AND created_at <= $${i}::timestamptz`;
      params.push(endDate);
      i += 1;
    }
    const { rows } = await query(
      `SELECT
         date_trunc('month', created_at AT TIME ZONE 'UTC') AS month,
         COALESCE(SUM(price_cents), 0)::bigint AS total_price_cents,
         COALESCE(SUM(ai_cost_cents), 0)::bigint AS total_ai_cost_cents,
         COUNT(*)::int AS project_count
       FROM projects
       WHERE ${cond}
       GROUP BY 1
       ORDER BY 1 ASC`,
      params,
    );
    const byMonth = rows.map((r) => {
      const price = Number(r.total_price_cents);
      const cost = Number(r.total_ai_cost_cents);
      return {
        month: r.month,
        totalPriceCents: price,
        totalAiCostCents: cost,
        marginCents: price - cost,
        projectCount: r.project_count,
      };
    });
    const totals = byMonth.reduce(
      (acc, m) => ({
        totalPriceCents: acc.totalPriceCents + m.totalPriceCents,
        totalAiCostCents: acc.totalAiCostCents + m.totalAiCostCents,
        marginCents: acc.marginCents + m.marginCents,
      }),
      { totalPriceCents: 0, totalAiCostCents: 0, marginCents: 0 },
    );
    res.json({ byMonth, totals });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
