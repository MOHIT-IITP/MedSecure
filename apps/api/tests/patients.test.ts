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

describe('Patient Profile and Medical Details API (Phase 4)', () => {
  let patientCookie: string[];
  let doctorCookie: string[];

  beforeEach(async () => {
    mockDb.reset();

    // Register patient
    const patientRes = await request(app).post('/api/auth/signup').send({
      email: 'patient@example.com',
      password: 'Password123!',
      name: 'Alice Patient',
      role: 'patient',
    });
    patientCookie = patientRes.headers['set-cookie'] as unknown as string[];

    // Register doctor
    const doctorRes = await request(app).post('/api/auth/signup').send({
      email: 'doctor@example.com',
      password: 'Password123!',
      name: 'Dr. Bob',
      role: 'doctor',
    });
    doctorCookie = doctorRes.headers['set-cookie'] as unknown as string[];
  });

  describe('Patient Profile (/api/patients/me)', () => {
    it('should retrieve own profile for authenticated patient', async () => {
      const res = await request(app)
        .get('/api/patients/me')
        .set('Cookie', patientCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBeDefined();
    });

    it('should update own profile for authenticated patient', async () => {
      const updateData = {
        dateOfBirth: '1995-05-12',
        gender: 'Female',
        address: '123 Main St, Springfield',
        emergencyContactName: 'John Patient',
        emergencyContactPhone: '+15559876543',
        emergencyContactRelationship: 'Spouse',
      };

      const res = await request(app)
        .put('/api/patients/me')
        .set('Cookie', patientCookie)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dateOfBirth).toBe('1995-05-12');
      expect(res.body.data.address).toBe('123 Main St, Springfield');
      expect(res.body.data.emergencyContactName).toBe('John Patient');
    });

    it('should forbid doctor from accessing patient profile route', async () => {
      const res = await request(app)
        .get('/api/patients/me')
        .set('Cookie', doctorCookie);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should return 401 when no session cookie is sent', async () => {
      const res = await request(app).get('/api/patients/me');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Medical Details (/api/medical-details/me)', () => {
    it('should retrieve own medical details for authenticated patient', async () => {
      const res = await request(app)
        .get('/api/medical-details/me')
        .set('Cookie', patientCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBeDefined();
    });

    it('should update own sensitive medical details', async () => {
      const updateMedicalData = {
        bloodGroup: 'B+',
        allergies: 'Penicillin, Aspirin',
        chronicConditions: 'Asthma',
        organDonor: 'yes',
        emergencyNotes: 'Severe penicillin allergy. Carry rescue inhaler.',
      };

      const res = await request(app)
        .put('/api/medical-details/me')
        .set('Cookie', patientCookie)
        .send(updateMedicalData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bloodGroup).toBe('B+');
      expect(res.body.data.allergies).toBe('Penicillin, Aspirin');
      expect(res.body.data.organDonor).toBe('yes');
      expect(res.body.data.emergencyNotes).toContain('Severe penicillin allergy');
    });
  });
});
