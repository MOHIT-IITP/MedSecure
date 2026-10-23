import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { healthRouter } from './health.router';
import { authRouter } from '../modules/auth/auth.router';
import { patientsRouter } from '../modules/patients/patients.router';
import { healthLogsRouter } from '../modules/health-logs/health-logs.router';
import { medicalDetailsRouter } from '../modules/medical-details/medical-details.router';
import { qrRouter, publicPatientsRouter } from '../modules/qr/qr.router';
import { openApiSpec } from '../docs/openapi';

export const apiRouter = Router();

// OpenAPI documentation endpoints
apiRouter.get('/openapi.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiSpec);
});
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Health probes
apiRouter.use(healthRouter);

// Authentication module
apiRouter.use('/auth', authRouter);

// Health logs mounted under /patients/me/health-logs
apiRouter.use('/patients/me/health-logs', healthLogsRouter);

// Patient profile module
apiRouter.use('/patients', patientsRouter);

// Medical details module
apiRouter.use('/medical-details', medicalDetailsRouter);

// QR Code token management
apiRouter.use('/qr', qrRouter);

// Public emergency QR patient route
apiRouter.use('/public/patients', publicPatientsRouter);
