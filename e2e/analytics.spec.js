const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Analytics API', () => {
  test('GET /api/analytics/quality/trends returns quality data', async ({ request }) => {
    const res = await request.get('/api/analytics/quality/trends?groupBy=month', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/analytics/experts/top returns leaderboard', async ({ request }) => {
    const res = await request.get('/api/analytics/experts/top', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/analytics/costs/summary returns cost breakdown', async ({ request }) => {
    const res = await request.get('/api/analytics/costs/summary', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/analytics/revenue/summary returns revenue data', async ({ request }) => {
    const res = await request.get('/api/analytics/revenue/summary', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });
});
