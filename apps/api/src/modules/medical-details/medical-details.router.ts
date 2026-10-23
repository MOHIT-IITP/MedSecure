import { Router } from 'express';
import { updateMedicalDetailsSchema } from '@medsecure/validation';
import { MedicalDetailsController } from './medical-details.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';

export const medicalDetailsRouter = Router();

medicalDetailsRouter.get(
  '/me',
  requireAuth,
  requireRole('patient'),
  MedicalDetailsController.getMyDetails
);

medicalDetailsRouter.put(
  '/me',
  requireAuth,
  requireRole('patient'),
  validateBody(updateMedicalDetailsSchema),
  MedicalDetailsController.updateMyDetails
);
