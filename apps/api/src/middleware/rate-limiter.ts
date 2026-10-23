import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '@medsecure/types';

/**
 * Standard rate-limit exceeded handler returning consistent JSON format
 */
function rateLimitHandler(req: Request, res: Response, message: string): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message,
    },
    requestId: req.id,
    timestamp: new Date().toISOString(),
  };

  res.status(429).json(response);
}

/**
 * Rate limiter for sensitive authentication endpoints (signup, login)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    rateLimitHandler(req, res, 'Too many authentication attempts. Please try again in 15 minutes.');
  },
});

/**
 * Rate limiter for public emergency QR token lookups
 */
export const publicQrRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    rateLimitHandler(req, res, 'Too many QR lookup requests. Please try again later.');
  },
});
