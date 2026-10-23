import { Router } from 'express';
import { createQrTokenSchema, publicTokenParamSchema } from '@medsecure/validation';
import { QrController } from './qr.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody, validateParams } from '../../middleware/validate';
import { publicQrRateLimiter } from '../../middleware/rate-limiter';

export const qrRouter = Router();

qrRouter.post(
  '/',
  requireAuth,
  requireRole('patient'),
  validateBody(createQrTokenSchema),
  QrController.generate
);

qrRouter.post(
  '/revoke',
  requireAuth,
  requireRole('patient'),
  QrController.revoke
);

export const publicPatientsRouter = Router();

publicPatientsRouter.get(
  '/:token',
  publicQrRateLimiter,
  validateParams(publicTokenParamSchema),
  QrController.getPublicRecord
);
