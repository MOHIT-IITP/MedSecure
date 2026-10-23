import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import * as dbModule from '@medsecure/db';
import { createMockDb } from './mock-db';
import { app } from '../src/app';

const mockDb = createMockDb();

vi.mock('@medsecure/db', async () => {
  const actual = await vi.importActual<typeof import('@medsecure/db')>('@medsecure/db');
  return {
    ...actual,
    getDb: () => mockDb,
    checkDatabaseConnection: vi.fn().mockResolvedValue({ connected: true }),
  };
});

describe('Authentication API (Phase 3)', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  const validSignupData = {
    email: 'patient.test@example.com',
    password: 'SecurePassword123!',
    name: 'Jane Doe',
    role: 'patient',
    phone: '+15551234567',
  };

  describe('POST /api/auth/signup', () => {
    it('should register a new patient, set HTTP-only cookie, and omit password hash', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('patient.test@example.com');
      expect(res.body.data.user.name).toBe('Jane Doe');
      expect(res.body.data.user.role).toBe('patient');
      expect((res.body.data.user as any).passwordHash).toBeUndefined();
      expect((res.body.data.user as any).password).toBeUndefined();

      // Check HTTP-only cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('medsecure_session=');
      expect(cookies[0]).toContain('HttpOnly');

      // Verify records in mock db
      expect(mockDb._store.users.length).toBe(1);
      expect(mockDb._store.sessions.length).toBe(1);
      expect(mockDb._store.patientProfiles.length).toBe(1);
      expect(mockDb._store.medicalDetails.length).toBe(1);
    });

    it('should fail with 400 when password does not meet policy requirements', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...validSignupData,
          password: 'weakpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with 409 when email already exists', async () => {
      // First signup
      await request(app).post('/api/auth/signup').send(validSignupData);

      // Attempt duplicate signup
      const res = await request(app).post('/api/auth/signup').send(validSignupData);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /api/auth/login and Session Management', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send(validSignupData);
    });

    it('should successfully log in with valid credentials and return HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'patient.test@example.com',
          password: 'SecurePassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('patient.test@example.com');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('medsecure_session=');
      expect(cookies[0]).toContain('HttpOnly');
    });

    it('should return 401 with generic message on wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'patient.test@example.com',
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
      expect(res.body.error.message).toBe('Invalid email or password.');
    });

    it('should return 401 with generic message on non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown.user@example.com',
          password: 'SecurePassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/auth/me and POST /api/auth/logout', () => {
    it('should retrieve current user with valid session cookie and revoke on logout', async () => {
      // 1. Sign up to get cookie
      const signupRes = await request(app).post('/api/auth/signup').send(validSignupData);
      const cookie = signupRes.headers['set-cookie'];

      // 2. Access /api/auth/me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookie);

      expect(meRes.status).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.user.email).toBe('patient.test@example.com');

      // 3. Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookie);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Verify session was marked revoked in DB
      const sessionInDb = mockDb._store.sessions[0];
      expect(sessionInDb.revokedAt).toBeDefined();

      // 4. Access /api/auth/me with revoked cookie must now fail with 401
      const meAfterLogout = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookie);

      expect(meAfterLogout.status).toBe(401);
      expect(meAfterLogout.body.error.code).toBe('SESSION_REVOKED');
    });

    it('should reject unauthenticated request to /api/auth/me with 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
