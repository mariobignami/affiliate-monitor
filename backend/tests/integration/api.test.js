const request = require('supertest');
const app = require('../../src/app');

describe('Health Check', () => {
  test('GET /api/v1/health should return 200', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'API is running');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Root Endpoint', () => {
  test('GET / should return API info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Affiliate Monitor API');
    expect(response.body).toHaveProperty('version');
  });
});

describe('Not Found Handler', () => {
  test('GET /nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/nonexistent')
      .expect(404);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Resource not found');
  });
});
