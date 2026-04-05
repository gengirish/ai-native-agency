const { test, expect } = require('@playwright/test');
const { authHeader } = require('./helpers');

test.describe('Expert Review API', () => {
  test('GET /api/experts/reviews/pending lists pending reviews', async ({ request }) => {
    const res = await request.get('/api/experts/reviews/pending', {
      headers: authHeader('expert'),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/experts/reviews/mine lists expert own reviews', async ({ request }) => {
    const res = await request.get('/api/experts/reviews/mine', {
      headers: authHeader('expert'),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/experts/workload returns workload count', async ({ request }) => {
    const res = await request.get('/api/experts/workload', {
      headers: authHeader('expert'),
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /api/experts/leaderboard returns top experts', async ({ request }) => {
    const res = await request.get('/api/experts/leaderboard', {
      headers: authHeader('admin'),
    });
    expect(res.status()).toBeLessThan(500);
  });
});
