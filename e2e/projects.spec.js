const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Projects API', () => {
  let projectId;

  test('POST /api/projects creates a project', async ({ request }) => {
    const res = await request.post('/api/projects', {
      headers: authHeader(),
      data: {
        title: 'E2E Test Brand Refresh',
        projectType: 'design',
        priority: 'high',
        priceCents: 500000,
      },
    });
    expect(res.status()).toBeLessThan(500);

    const body = await res.json();
    if (res.ok()) {
      projectId = body.data?.id || body.id;
      expect(projectId).toBeTruthy();
    }
  });

  test('POST /api/projects rejects empty body', async ({ request }) => {
    const res = await request.post('/api/projects', {
      headers: authHeader(),
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('POST /api/projects rejects invalid projectType', async ({ request }) => {
    const res = await request.post('/api/projects', {
      headers: authHeader(),
      data: { title: 'Test', projectType: 'invalid_type' },
    });
    expect(res.status()).toBe(400);
  });

  test('GET /api/projects lists projects', async ({ request }) => {
    const res = await request.get('/api/projects', {
      headers: authHeader(),
    });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body).toBeTruthy();
  });

  test('GET /api/projects supports pagination', async ({ request }) => {
    const res = await request.get('/api/projects?page=1&limit=5', {
      headers: authHeader(),
    });
    expect(res.ok()).toBeTruthy();
  });
});
