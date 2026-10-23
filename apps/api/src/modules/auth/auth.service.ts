import { eq } from 'drizzle-orm';
import {
  getDb,
  users,
  sessions,
  patientProfiles,
  medicalDetails,
  NewUser,
} from '@medsecure/db';
import { SignupInput, LoginInput } from '@medsecure/validation';
import { SafeUser, UserRole } from '@medsecure/types';
import { hashPassword, verifyPassword } from '../../utils/passwords';
import {
  generateRandomToken,
  hashToken,
  signSessionToken,
} from '../../utils/tokens';

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface SessionContextMetadata {
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  /**
   * Registers a new user account and creates initial patient records within a transaction
   */
  static async signup(
    input: SignupInput,
    meta: SessionContextMetadata
  ): Promise<{ user: SafeUser; token: string }> {
    const db = getDb();
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check for existing user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      throw new AuthError('EMAIL_EXISTS', 'An account with this email address already exists.', 409);
    }

    const passwordHash = await hashPassword(input.password);

    // Multi-step write executed inside a database transaction
    return db.transaction(async (tx) => {
      const newUserPayload: NewUser = {
        email: normalizedEmail,
        passwordHash,
        name: input.name.trim(),
        role: input.role,
        phone: input.phone || null,
      };

      const insertedUsers = await tx
        .insert(users)
        .values(newUserPayload)
        .returning();

      const createdUser = insertedUsers[0];

      // If registered as a patient, initialize empty profile and medical details
      if (createdUser.role === 'patient') {
        await tx.insert(patientProfiles).values({
          userId: createdUser.id,
        });

        await tx.insert(medicalDetails).values({
          userId: createdUser.id,
        });
      }

      // Create initial active session
      const rawSecret = generateRandomToken(32);
      const tokenHash = hashToken(rawSecret);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const insertedSessions = await tx
        .insert(sessions)
        .values({
          userId: createdUser.id,
          tokenHash,
          expiresAt,
          userAgent: meta.userAgent || null,
          ipAddress: meta.ipAddress || null,
        })
        .returning();

      const createdSession = insertedSessions[0];
      const token = signSessionToken({
        sessionId: createdSession.id,
        userId: createdUser.id,
      });

      const safeUser: SafeUser = {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role as UserRole,
        phone: createdUser.phone,
        createdAt: createdUser.createdAt.toISOString(),
        updatedAt: createdUser.updatedAt.toISOString(),
      };

      return { user: safeUser, token };
    });
  }

  /**
   * Authenticates user credentials and issues a revocable session
   */
  static async login(
    input: LoginInput,
    meta: SessionContextMetadata
  ): Promise<{ user: SafeUser; token: string }> {
    const db = getDb();
    const normalizedEmail = input.email.trim().toLowerCase();

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (userRecords.length === 0) {
      // Use generic error message to prevent user enumeration
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    const user = userRecords[0];
    const passwordValid = await verifyPassword(input.password, user.passwordHash);

    if (!passwordValid) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    // Create new revocable session in database
    const rawSecret = generateRandomToken(32);
    const tokenHash = hashToken(rawSecret);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const insertedSessions = await db
      .insert(sessions)
      .values({
        userId: user.id,
        tokenHash,
        expiresAt,
        userAgent: meta.userAgent || null,
        ipAddress: meta.ipAddress || null,
      })
      .returning();

    const session = insertedSessions[0];
    const token = signSessionToken({
      sessionId: session.id,
      userId: user.id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return { user: safeUser, token };
  }

  /**
   * Revokes the active session in the database
   */
  static async logout(sessionId: string): Promise<void> {
    const db = getDb();
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, sessionId));
  }
}
