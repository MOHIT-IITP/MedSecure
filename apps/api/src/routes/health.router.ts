import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '@medsecure/db';
import { ApiSuccessResponse, ApiErrorResponse, HealthStatus, ReadinessStatus } from '@medsecure/types';
import { env } from '../config/env';

export const healthRouter = Router();

/**
 * GET /api/health
 * Liveness probe: verifies that the HTTP server is responsive and accepting traffic.
 */
healthRouter.get('/health', (req: Request, res: Response) => {
  const healthData: HealthStatus = {
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '0.1.0',
  };

  const response: ApiSuccessResponse<HealthStatus> = {
    success: true,
    data: healthData,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * GET /api/ready
 * Readiness probe: verifies that downstream dependencies (Supabase PostgreSQL) are operational.
 */
healthRouter.get('/ready', async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();

  // If in offline development mode without DATABASE_URL, report readiness accordingly
  if (env.ALLOW_OFFLINE_DEV && (!env.DATABASE_URL || env.DATABASE_URL.trim() === '')) {
    const readinessData: ReadinessStatus = {
      status: 'ready',
      database: 'disconnected',
      timestamp,
      error: 'Running in ALLOW_OFFLINE_DEV mode with no database configured',
    };

    const response: ApiSuccessResponse<ReadinessStatus> = {
      success: true,
      data: readinessData,
      requestId: req.id,
      timestamp,
    };

    res.status(200).json(response);
    return;
  }

  const dbStatus = await checkDatabaseConnection(env.DATABASE_URL);

  if (dbStatus.connected) {
    const readinessData: ReadinessStatus = {
      status: 'ready',
      database: 'connected',
      timestamp,
    };

    const response: ApiSuccessResponse<ReadinessStatus> = {
      success: true,
      data: readinessData,
      requestId: req.id,
      timestamp,
    };

    res.status(200).json(response);
  } else {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database connection failed',
        details: {
          database: 'disconnected',
          reason: dbStatus.error,
        },
      },
      requestId: req.id,
      timestamp,
    };

    res.status(503).json(errorResponse);
  }
});
