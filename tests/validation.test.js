require('./setup');
const request = require('supertest');
const app = require('../src/server');

function authHeader(role = 'admin') {
  const token = Buffer.from(JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000001',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role,
  })).toString('base64');
  return `Bearer ${token}`;
}

describe('Input Validation', () => {
  test('POST /api/projects with empty body returns 400', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', authHeader())
      .send({});

    // Should fail validation (400) since title and projectType are required
    expect(res.status).toBe(400);
  });
});
