import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { checkDatabaseConnection } from '@medsecure/db';
import { app } from '../src/app';

vi.mock('@medsecure/db', async () => {
  const actual = await vi.importActual<typeof import('@medsecure/db')>('@medsecure/db');
  return {
    ...actual,
    checkDatabaseConnection: vi.fn(),
  };
});

describe('Health and Readiness Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 with liveness status and request ID header', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.body).toMatchObject({
        success: true,
        data: {
          status: 'ok',
          environment: 'test',
          version: '0.1.0',
        },
      });
      expect(typeof res.body.data.uptime).toBe('number');
      expect(res.body.requestId).toBe(res.headers['x-request-id']);
    });
  });

  describe('GET /api/ready', () => {
    it('should return 200 when database connectivity is healthy', async () => {
      vi.mocked(checkDatabaseConnection).mockResolvedValueOnce({
        connected: true,
      });

      const res = await request(app).get('/api/ready');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          status: 'ready',
          database: 'connected',
        },
      });
    });

    it('should return 503 when database connectivity fails', async () => {
      vi.mocked(checkDatabaseConnection).mockResolvedValueOnce({
        connected: false,
        error: 'Connection timeout to host db.supabase.co:6543',
      });

      const res = await request(app).get('/api/ready');

      expect(res.status).toBe(503);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Database connection failed',
          details: {
            database: 'disconnected',
            reason: 'Connection timeout to host db.supabase.co:6543',
          },
        },
      });
    });
  });

  describe('Not Found and CORS handlers', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/unknown-endpoint');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
        },
      });
    });

    it('should allow requests from configured DOCS_ORIGIN', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3001');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3001');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should block requests from unauthorized origins', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://malicious-site.com');

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        success: false,
        error: {
          code: 'CORS_FORBIDDEN',
        },
      });
    });
  });
});
