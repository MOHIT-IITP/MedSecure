import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { requestIdMiddleware } from './middleware/request-id';
import { requestLogger } from './middleware/logger';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import { apiRouter } from './routes';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // Configurable CORS restricted to configured frontend origins
  app.use(cors(corsOptions));

  // Request ID tracking
  app.use(requestIdMiddleware);

  // Safe Request Logger
  app.use(requestLogger);

  // Body parsers with size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Mount API Router
  app.use('/api', apiRouter);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
