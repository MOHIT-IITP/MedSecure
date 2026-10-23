import { Router } from 'express';
import { signupSchema, loginSchema } from '@medsecure/validation';
import { AuthController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { authRateLimiter } from '../../middleware/rate-limiter';
import { requireAuth } from '../../middleware/auth';

export const authRouter = Router();

authRouter.post(
  '/signup',
  authRateLimiter,
  validateBody(signupSchema),
  AuthController.signup
);

authRouter.post(
  '/login',
  authRateLimiter,
  validateBody(loginSchema),
  AuthController.login
);

authRouter.post(
  '/logout',
  requireAuth,
  AuthController.logout
);

authRouter.get(
  '/me',
  requireAuth,
  AuthController.getMe
);
