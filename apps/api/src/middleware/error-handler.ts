import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorResponse } from '@medsecure/types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.id;
  const timestamp = new Date().toISOString();

  // Handle Zod Validation Errors
  if (err instanceof ZodError || err.name === 'ZodError') {
    const zodErr = err as ZodError;
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload or parameters validation failed',
        details: zodErr.issues ? zodErr.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })) : [],
      },
      requestId,
      timestamp,
    };
    res.status(400).json(response);
    return;
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Malformed JSON payload in request body',
      },
      requestId,
      timestamp,
    };
    res.status(400).json(response);
    return;
  }

  // Handle CORS errors
  if (err.message && err.message.startsWith('CORS blocked')) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'CORS_FORBIDDEN',
        message: err.message,
      },
      requestId,
      timestamp,
    };
    res.status(403).json(response);
    return;
  }

  // Log unexpected errors safely
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Unhandled Error] [${requestId}]`, err.stack || err.message);
  }

  // Generic 500 Internal Server Error
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An internal server error occurred'
          : err.message || 'An unexpected error occurred',
    },
    requestId,
    timestamp,
  };

  res.status(500).json(response);
}
