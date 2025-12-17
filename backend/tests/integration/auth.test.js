const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };

  let authToken;

  describe('POST /api/v1/auth/register', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
      
      authToken = response.body.data.token;
    });

    test('should not register with duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
    });

    test('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    test('should get profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('email', testUser.email);
    });

    test('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    test('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
