import { Request, Response } from 'express';
import { ApiErrorResponse } from '@medsecure/types';

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Resource not found at ${req.method} ${req.originalUrl || req.url}`,
    },
    requestId: req.id,
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
}
