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

describe('Health Logs API with Pagination (Phase 4)', () => {
  let patientCookie: string[];

  beforeEach(async () => {
    mockDb.reset();

    const signupRes = await request(app).post('/api/auth/signup').send({
      email: 'log.patient@example.com',
      password: 'Password123!',
      name: 'Sam Patient',
      role: 'patient',
    });
    patientCookie = signupRes.headers['set-cookie'] as unknown as string[];
  });

  it('should create a patient note in health logs', async () => {
    const res = await request(app)
      .post('/api/patients/me/health-logs')
      .set('Cookie', patientCookie)
      .send({
        title: 'Morning Blood Pressure',
        content: 'Felt slight dizziness upon waking up. Blood pressure was slightly elevated.',
        vitals: 'BP: 135/88 mmHg, Pulse: 72 bpm',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Morning Blood Pressure');
    expect(res.body.data.entryType).toBe('patient_note');
    expect(res.body.data.vitals).toBe('BP: 135/88 mmHg, Pulse: 72 bpm');
  });

  it('should fail with 400 when log title or content is missing', async () => {
    const res = await request(app)
      .post('/api/patients/me/health-logs')
      .set('Cookie', patientCookie)
      .send({
        title: '',
        content: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should retrieve paginated health logs', async () => {
    // Create 3 logs
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/patients/me/health-logs')
        .set('Cookie', patientCookie)
        .send({
          title: `Health Entry #${i}`,
          content: `Notes for day ${i}`,
        });
    }

    const res = await request(app)
      .get('/api/patients/me/health-logs?page=1&limit=2')
      .set('Cookie', patientCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBe(2);
    expect(res.body.data.pagination).toMatchObject({
      total: 3,
      page: 1,
      limit: 2,
      totalPages: 2,
    });
  });

  it('should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/patients/me/health-logs');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
