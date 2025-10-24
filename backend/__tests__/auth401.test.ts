import request from 'supertest';
import { app } from '../src/app';

describe('Auth middleware', () => {
  it('GET /api/users without token should return 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
    expect(res.body?.message).toBeDefined();
  });
});
