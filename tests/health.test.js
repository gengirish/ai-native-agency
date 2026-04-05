require('./setup');
const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  test('GET /api/health returns database connection status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('database', 'connected');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('404 Handling', () => {
  test('Unknown route returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});

describe('Auth Middleware', () => {
  test('Protected route returns 401 without token', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
  });

  test('Protected route accepts valid token', async () => {
    const token = Buffer.from(JSON.stringify({
      userId: '00000000-0000-0000-0000-000000000001',
      tenantId: '00000000-0000-0000-0000-000000000001',
      role: 'admin'
    })).toString('base64');

    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    // Should not be 401 (auth passed), may be 200 or other status depending on data
    expect(res.status).not.toBe(401);
  });
});
