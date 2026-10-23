import { Router } from 'express';
import { updatePatientProfileSchema } from '@medsecure/validation';
import { PatientsController } from './patients.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';

export const patientsRouter = Router();

patientsRouter.get(
  '/me',
  requireAuth,
  requireRole('patient'),
  PatientsController.getMyProfile
);

patientsRouter.put(
  '/me',
  requireAuth,
  requireRole('patient'),
  validateBody(updatePatientProfileSchema),
  PatientsController.updateMyProfile
);
