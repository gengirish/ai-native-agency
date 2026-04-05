const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Templates API', () => {
  test('GET /api/templates lists templates', async ({ request }) => {
    const res = await request.get('/api/templates', {
      headers: authHeader(),
    });
    expect(res.ok()).toBeTruthy();
  });

  test('GET /api/templates/defaults returns seed templates', async ({ request }) => {
    const res = await request.get('/api/templates/defaults', {
      headers: authHeader(),
    });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    const data = body.data || body;
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/templates/best/design finds best design template', async ({ request }) => {
    const res = await request.get('/api/templates/best/design', {
      headers: authHeader(),
    });
    expect(res.status()).toBeLessThan(500);
  });
});
