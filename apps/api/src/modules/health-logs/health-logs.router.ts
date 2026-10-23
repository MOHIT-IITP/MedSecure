import { Router } from 'express';
import { createHealthLogSchema, healthLogQuerySchema } from '@medsecure/validation';
import { HealthLogsController } from './health-logs.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';

export const healthLogsRouter = Router();

healthLogsRouter.get(
  '/',
  requireAuth,
  requireRole('patient'),
  validateQuery(healthLogQuerySchema),
  HealthLogsController.getMyLogs
);

healthLogsRouter.post(
  '/',
  requireAuth,
  requireRole('patient'),
  validateBody(createHealthLogSchema),
  HealthLogsController.createMyLog
);
