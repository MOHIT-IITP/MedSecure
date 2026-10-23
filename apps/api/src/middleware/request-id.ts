import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.header('X-Request-Id');
  const requestId = existingId || randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}
