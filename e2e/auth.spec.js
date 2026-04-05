const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Authentication & Authorization', () => {
  test('returns 401 without auth token', async ({ request }) => {
    const res = await request.get('/api/projects');
    expect(res.status()).toBe(401);
  });

  test('returns 401 with malformed token', async ({ request }) => {
    const res = await request.get('/api/projects', {
      headers: { Authorization: 'Bearer not-valid-base64-json' },
    });
    expect(res.status()).toBe(401);
  });

  test('accepts valid admin token', async ({ request }) => {
    const res = await request.get('/api/projects', {
      headers: authHeader('admin'),
    });
    expect(res.status()).not.toBe(401);
    expect(res.status()).not.toBe(403);
  });

  test('accepts valid client token', async ({ request }) => {
    const res = await request.get('/api/projects', {
      headers: authHeader('client'),
    });
    expect(res.status()).not.toBe(401);
  });

  test('accepts valid expert token', async ({ request }) => {
    const res = await request.get('/api/projects', {
      headers: authHeader('expert'),
    });
    expect(res.status()).not.toBe(401);
  });
});
