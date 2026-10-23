import crypto from 'node:crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Generates a cryptographically random hex string
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Computes a SHA-256 hash of an opaque token for secure database storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export interface SessionJwtPayload {
  sessionId: string;
  userId: string;
}

/**
 * Signs a session JWT containing the session ID and user ID
 */
export function signSessionToken(
  payload: SessionJwtPayload,
  expiresIn: SignOptions['expiresIn'] = '7d'
): string {
  const options: SignOptions = {
    expiresIn,
    algorithm: 'HS256',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Verifies and decodes a session JWT
 */
export function verifySessionToken(token: string): SessionJwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return decoded as SessionJwtPayload;
  } catch {
    return null;
  }
}
