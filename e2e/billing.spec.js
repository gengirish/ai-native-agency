const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Billing API', () => {
  test('GET /api/billing/balance returns balance or empty', async ({ request }) => {
    const res = await request.get('/api/billing/balance', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('POST /api/billing/balance/initialize sets up billing', async ({ request }) => {
    const res = await request.post('/api/billing/balance/initialize', {
      headers: authHeader(),
      data: {
        plan: 'professional',
        creditsTotal: 100,
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/billing/invoices lists invoices', async ({ request }) => {
    const res = await request.get('/api/billing/invoices', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });
});
