import { Request, Response, NextFunction } from 'express';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { getDb, sessions, users } from '@medsecure/db';
import { SafeUser, UserRole, ApiErrorResponse } from '@medsecure/types';
import { verifySessionToken } from '../utils/tokens';

export const AUTH_COOKIE_NAME = 'medsecure_session';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
      sessionId?: string;
    }
  }
}

/**
 * Middleware ensuring incoming request has a valid, non-revoked session.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[AUTH_COOKIE_NAME] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication session required. Please sign in.',
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    };
    res.status(401).json(response);
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload || !payload.sessionId || !payload.userId) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_SESSION',
        message: 'Session token is invalid or expired. Please sign in again.',
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    };
    res.status(401).json(response);
    return;
  }

  try {
    const db = getDb();
    const now = new Date();

    // Verify session in database is active and not revoked
    const activeSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, payload.sessionId),
          eq(sessions.userId, payload.userId),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, now)
        )
      )
      .limit(1);

    if (activeSessions.length === 0) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'SESSION_REVOKED',
          message: 'Session has been invalidated or expired. Please sign in again.',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    // Retrieve corresponding user record
    const userRecords = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userRecords.length === 0) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found.',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    const u = userRecords[0];
    req.user = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      phone: u.phone,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    };
    req.sessionId = payload.sessionId;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware restricting access to specified roles
 */
export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: ${roles.join(', ')}`,
        },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
}
