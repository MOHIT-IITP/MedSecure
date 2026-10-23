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

describe('QR Access & Public Emergency API (Phase 4)', () => {
  let patientCookie: string[];

  beforeEach(async () => {
    mockDb.reset();

    // Register patient
    const signupRes = await request(app).post('/api/auth/signup').send({
      email: 'qr.patient@example.com',
      password: 'Password123!',
      name: 'Diana Prince',
      role: 'patient',
    });
    patientCookie = signupRes.headers['set-cookie'] as unknown as string[];

    // Update emergency profile and medical details
    await request(app)
      .put('/api/patients/me')
      .set('Cookie', patientCookie)
      .send({
        emergencyContactName: 'Clark Kent',
        emergencyContactPhone: '+15551239999',
        emergencyContactRelationship: 'Friend',
      });

    await request(app)
      .put('/api/medical-details/me')
      .set('Cookie', patientCookie)
      .send({
        bloodGroup: 'AB+',
        allergies: 'Latex',
        chronicConditions: 'None',
        emergencyNotes: 'Allergic to latex gloves.',
        organDonor: 'yes',
      });
  });

  it('should generate a revocable QR token without storing the raw token in the database', async () => {
    const res = await request(app)
      .post('/api/qr')
      .set('Cookie', patientCookie)
      .send({ expiresInHours: 48, label: 'Medical Alert Bracelet' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.label).toBe('Medical Alert Bracelet');

    // Verify raw token is NOT in database
    const rawToken = res.body.data.token;
    const dbRecord = mockDb._store.qrAccessTokens[0];
    expect(dbRecord).toBeDefined();
    expect(dbRecord.tokenHash).not.toBe(rawToken);
    expect(dbRecord.tokenHash.length).toBe(64); // SHA-256 length
  });

  it('should allow public emergency viewing and write an access audit log', async () => {
    // 1. Generate token
    const qrRes = await request(app)
      .post('/api/qr')
      .set('Cookie', patientCookie)
      .send({ expiresInHours: 24 });

    const token = qrRes.body.data.token;

    // 2. Fetch public emergency data (unauthenticated)
    const publicRes = await request(app).get(`/api/public/patients/${token}`);

    expect(publicRes.status).toBe(200);
    expect(publicRes.body.success).toBe(true);
    expect(publicRes.body.data).toMatchObject({
      patientName: 'Diana Prince',
      bloodGroup: 'AB+',
      allergies: 'Latex',
      emergencyNotes: 'Allergic to latex gloves.',
      emergencyContactName: 'Clark Kent',
      emergencyContactPhone: '+15551239999',
      organDonor: 'yes',
    });

    // Verify clinical consultation history or sensitive account fields are NOT exposed
    expect(publicRes.body.data.passwordHash).toBeUndefined();
    expect(publicRes.body.data.healthLogs).toBeUndefined();

    // Verify access audit log was written
    expect(mockDb._store.qrAccessLogs.length).toBe(1);
    expect(mockDb._store.qrAccessLogs[0].qrTokenId).toBe(mockDb._store.qrAccessTokens[0].id);
  });

  it('should revoke QR token and reject subsequent public access', async () => {
    // 1. Generate token
    const qrRes = await request(app)
      .post('/api/qr')
      .set('Cookie', patientCookie)
      .send({ expiresInHours: 24 });
    const token = qrRes.body.data.token;

    // 2. Revoke token
    const revokeRes = await request(app)
      .post('/api/qr/revoke')
      .set('Cookie', patientCookie);

    expect(revokeRes.status).toBe(200);
    expect(revokeRes.body.success).toBe(true);

    // Verify DB record marked revoked
    expect(mockDb._store.qrAccessTokens[0].revokedAt).toBeDefined();

    // 3. Subsequent public access must fail with 404
    const publicRes = await request(app).get(`/api/public/patients/${token}`);
    expect(publicRes.status).toBe(404);
    expect(publicRes.body.error.code).toBe('TOKEN_INVALID_OR_EXPIRED');
  });

  it('should return 404 for non-existent token', async () => {
    const res = await request(app).get('/api/public/patients/nonexistenttoken1234567890');
    expect(res.status).toBe(404);
  });
});
