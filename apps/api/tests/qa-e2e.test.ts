import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
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

describe('Phase 7: End-to-End Integration and QA Audit (18 Scenarios)', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  const patientCredentials = {
    email: 'sarah.qa@medsecure.io',
    password: 'Password99!Secure',
    name: 'Sarah Connor',
    role: 'patient',
    phone: '+1 555-0199',
  };

  let sessionCookie: string[];
  let generatedQrToken: string;

  // Scenario 1 & 17: Health and Readiness Endpoints
  describe('Scenario 1 & 17: Service Health and Readiness', () => {
    it('Scenario 17: should report healthy service status at /api/health', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.uptime).toBeTypeOf('number');
      expect(res.body.data.environment).toBeDefined();
    });

    it('Scenario 17: should report database readiness at /api/ready', async () => {
      const res = await request(app).get('/api/ready');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ready');
      expect(res.body.data.database).toBe('connected');
    });
  });

  // Scenario 2: Landing page and API runtime independence
  describe('Scenario 2: Architecture and Runtime Independence', () => {
    it('Scenario 2: should allow public access to documentation and schemas without authentication', async () => {
      const openapiRes = await request(app).get('/api/openapi.json');
      expect(openapiRes.status).toBe(200);
      expect(openapiRes.body.openapi).toBe('3.0.3');
      expect(openapiRes.body.info.title).toBe('MedSecure Backend API');
    });
  });

  // Scenario 3 & 4: Patient Registration & DB Records Verification
  describe('Scenario 3 & 4: Patient Registration and Database Record Creation', () => {
    it('Scenario 3 & 4: should register patient transactionally and populate initial profiles', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(patientCredentials);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(patientCredentials.email);
      expect(res.body.data.user.role).toBe('patient');
      expect(res.body.data.user.passwordHash).toBeUndefined();

      // Check cookie set
      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('medsecure_session=');
      expect(cookies[0]).toContain('HttpOnly');
      sessionCookie = cookies;

      // Scenario 4: Verify records in DB
      expect(mockDb._store.users.length).toBe(1);
      expect(mockDb._store.users[0].email).toBe(patientCredentials.email);
      expect(mockDb._store.patientProfiles.length).toBe(1);
      expect(mockDb._store.medicalDetails.length).toBe(1);
      expect(mockDb._store.sessions.length).toBe(1);
    });
  });

  // Scenario 5 & 6: Login, Invalid Credentials & Duplicate Rejection
  describe('Scenario 5 & 6: Authentication Security, Login, and Error Handling', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send(patientCredentials);
    });

    it('Scenario 5: should log in successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: patientCredentials.email,
          password: patientCredentials.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(patientCredentials.email);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('Scenario 6: should reject duplicate registration with 409 EMAIL_EXISTS', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(patientCredentials);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('Scenario 6: should reject invalid credentials with 401 INVALID_CREDENTIALS', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: patientCredentials.email,
          password: 'IncorrectPassword999!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // Scenario 7 & 8: Authenticated Dashboard Data & Medical Profile Updates
  describe('Scenario 7 & 8: Profile and Medical Details Management', () => {
    beforeEach(async () => {
      const res = await request(app).post('/api/auth/signup').send(patientCredentials);
      sessionCookie = res.headers['set-cookie'] as unknown as string[];
    });

    it('Scenario 7: should retrieve current authenticated user via /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', sessionCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Sarah Connor');
    });

    it('Scenario 8: should update personal demographic info and emergency contacts', async () => {
      const profileUpdate = {
        dateOfBirth: '1985-05-12',
        gender: 'female',
        address: '102 Tech Plaza, Silicon Valley, CA',
        emergencyContactName: 'John Connor',
        emergencyContactPhone: '+1 555-9000',
        emergencyContactRelationship: 'Son',
      };

      const res = await request(app)
        .put('/api/patients/me')
        .set('Cookie', sessionCookie)
        .send(profileUpdate);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.gender).toBe('female');
      expect(res.body.data.emergencyContactName).toBe('John Connor');
    });

    it('Scenario 8: should update medical details and clinical directives', async () => {
      const medicalUpdate = {
        bloodGroup: 'O+',
        allergies: 'Penicillin (Severe), Shellfish',
        medications: 'Ventolin Inhaler 100mcg',
        chronicConditions: 'Mild Asthma',
        organDonor: 'yes',
        emergencyNotes: 'Carries EpiPen in emergency kit.',
      };

      const res = await request(app)
        .put('/api/medical-details/me')
        .set('Cookie', sessionCookie)
        .send(medicalUpdate);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bloodGroup).toBe('O+');
      expect(res.body.data.allergies).toContain('Penicillin');
      expect(res.body.data.organDonor).toBe('yes');
    });
  });

  // Scenario 9, 10, 11, 12, 13: Emergency QR Token Lifecycle & Data Minimization
  describe('Scenario 9, 10, 11, 12, 13: Emergency QR Code Security and Triage Access', () => {
    beforeEach(async () => {
      const signupRes = await request(app).post('/api/auth/signup').send(patientCredentials);
      sessionCookie = signupRes.headers['set-cookie'] as unknown as string[];

      // Set medical details
      await request(app)
        .put('/api/medical-details/me')
        .set('Cookie', sessionCookie)
        .send({
          bloodGroup: 'AB-',
          allergies: 'Aspirin, Sulfa drugs',
          chronicConditions: 'Cardiac Arrhythmia',
          organDonor: 'yes',
          emergencyNotes: 'Pacemaker implanted (2023)',
        });

      // Set emergency contact
      await request(app)
        .put('/api/patients/me')
        .set('Cookie', sessionCookie)
        .send({
          emergencyContactName: 'Dr. Silberman',
          emergencyContactPhone: '+1 555-3211',
          emergencyContactRelationship: 'Physician',
        });

      // Add private health log (must never be exposed in public QR view)
      await request(app)
        .post('/api/patients/me/health-logs')
        .set('Cookie', sessionCookie)
        .send({
          title: 'Private Psychological Assessment',
          content: 'Confidential clinical discussion about stress triggers.',
          vitals: 'BP: 120/80',
        });
    });

    it('Scenario 9: should generate a cryptographic emergency QR token', async () => {
      const res = await request(app)
        .post('/api/qr')
        .set('Cookie', sessionCookie)
        .send({
          expiresInHours: 24,
          label: 'Emergency ID Card',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeTypeOf('string');
      expect(res.body.data.token.length).toBeGreaterThanOrEqual(32);
      generatedQrToken = res.body.data.token;
    });

    it('Scenario 10 & 11: should open public emergency profile without auth and enforce data minimization', async () => {
      // Generate token first
      const qrGen = await request(app)
        .post('/api/qr')
        .set('Cookie', sessionCookie)
        .send({ expiresInHours: 48 });

      const token = qrGen.body.data.token;

      // Access without any session cookie (unauthenticated first responder / paramedic)
      const publicRes = await request(app).get(`/api/public/patients/${token}`);

      expect(publicRes.status).toBe(200);
      expect(publicRes.body.success).toBe(true);

      const emergencyData = publicRes.body.data;
      expect(emergencyData.patientName).toBe('Sarah Connor');
      expect(emergencyData.bloodGroup).toBe('AB-');
      expect(emergencyData.allergies).toBe('Aspirin, Sulfa drugs');
      expect(emergencyData.emergencyNotes).toBe('Pacemaker implanted (2023)');
      expect(emergencyData.emergencyContactName).toBe('Dr. Silberman');
      expect(emergencyData.emergencyContactPhone).toBe('+1 555-3211');
      expect(emergencyData.organDonor).toBe('yes');

      // Scenario 11 DATA MINIMIZATION: Private logs and unshared records must NEVER exist
      expect(emergencyData.healthLogs).toBeUndefined();
      expect(emergencyData.consultations).toBeUndefined();
      expect(emergencyData.notes).toBeUndefined();
      expect(JSON.stringify(emergencyData)).not.toContain('Private Psychological Assessment');
      expect(JSON.stringify(emergencyData)).not.toContain('Confidential clinical discussion');
    });

    it('Scenario 12: should reject tampered or corrupted QR tokens with 404', async () => {
      const tamperedToken = 'tampered_invalid_token_99999999999999999';
      const res = await request(app).get(`/api/public/patients/${tamperedToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('TOKEN_INVALID_OR_EXPIRED');
    });

    it('Scenario 13: should immediately invalidate public access upon QR token revocation', async () => {
      // 1. Generate token
      const qrRes = await request(app)
        .post('/api/qr')
        .set('Cookie', sessionCookie)
        .send({ expiresInHours: 24 });
      const token = qrRes.body.data.token;

      // 2. Verify token is active
      const beforeRevoke = await request(app).get(`/api/public/patients/${token}`);
      expect(beforeRevoke.status).toBe(200);

      // 3. Revoke all tokens
      const revokeRes = await request(app)
        .post('/api/qr/revoke')
        .set('Cookie', sessionCookie);
      expect(revokeRes.status).toBe(200);
      expect(revokeRes.body.success).toBe(true);

      // 4. Access after revoke must return 404
      const afterRevoke = await request(app).get(`/api/public/patients/${token}`);
      expect(afterRevoke.status).toBe(404);
      expect(afterRevoke.body.error.code).toBe('TOKEN_INVALID_OR_EXPIRED');
    });
  });

  // Scenario 14 & 15: Logout, Cookie Clearing, Protected Route Security
  describe('Scenario 14 & 15: Session Revocation and Route Protection', () => {
    beforeEach(async () => {
      const res = await request(app).post('/api/auth/signup').send(patientCredentials);
      sessionCookie = res.headers['set-cookie'] as unknown as string[];
    });

    it('Scenario 14: should log out, clear cookies, and mark session revoked in DB', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', sessionCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify session cookie was cleared / expired
      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies[0]).toContain('medsecure_session=;');

      // Attempting to access protected route with old cookie must fail
      const protectedRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', sessionCookie);

      expect(protectedRes.status).toBe(401);
      expect(protectedRes.body.error.code).toBe('SESSION_REVOKED');
    });

    it('Scenario 15: should reject requests without session to all protected endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/api/auth/me' },
        { method: 'get', path: '/api/patients/me' },
        { method: 'put', path: '/api/patients/me' },
        { method: 'get', path: '/api/medical-details/me' },
        { method: 'put', path: '/api/medical-details/me' },
        { method: 'get', path: '/api/patients/me/health-logs' },
        { method: 'post', path: '/api/patients/me/health-logs' },
        { method: 'post', path: '/api/qr' },
        { method: 'post', path: '/api/qr/revoke' },
      ];

      for (const ep of endpoints) {
        const res = await (request(app) as any)[ep.method](ep.path);
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  // Scenario 16: Credentialed CORS
  describe('Scenario 16: CORS Configuration and Origin Whitelisting', () => {
    it('Scenario 16: should permit requests from configured origins with credentials', async () => {
      // WEB origin
      const webRes = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(webRes.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(webRes.headers['access-control-allow-credentials']).toBe('true');

      // DOCS origin
      const docsRes = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3001');

      expect(docsRes.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(docsRes.headers['access-control-allow-credentials']).toBe('true');
    });

    it('Scenario 16: should not reflect unauthorized origins in Access-Control-Allow-Origin', async () => {
      const evilRes = await request(app)
        .get('/api/health')
        .set('Origin', 'http://malicious-site.com');

      expect(evilRes.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  // Scenario 18: OpenAPI Documentation
  describe('Scenario 18: OpenAPI and API Documentation Verification', () => {
    it('Scenario 18: should serve valid OpenAPI 3.0 specification with all MedSecure modules', async () => {
      const res = await request(app).get('/api/openapi.json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe('3.0.3');

      const paths = Object.keys(res.body.paths);
      expect(paths).toContain('/auth/signup');
      expect(paths).toContain('/auth/login');
      expect(paths).toContain('/auth/logout');
      expect(paths).toContain('/auth/me');
      expect(paths).toContain('/patients/me');
      expect(paths).toContain('/medical-details/me');
      expect(paths).toContain('/patients/me/health-logs');
      expect(paths).toContain('/qr');
      expect(paths).toContain('/qr/revoke');
      expect(paths).toContain('/public/patients/{token}');
    });
  });
});
