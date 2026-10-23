import { eq, and, isNull, gt } from 'drizzle-orm';
import {
  getDb,
  qrAccessTokens,
  qrAccessLogs,
  users,
  patientProfiles,
  medicalDetails,
} from '@medsecure/db';
import { CreateQrTokenInput } from '@medsecure/validation';
import { QrPublicEmergencyView } from '@medsecure/types';
import { generateRandomToken, hashToken } from '../../utils/tokens';

export class QrService {
  /**
   * Generates a new cryptographically random, revocable QR token.
   * Only the token hash is stored in the database.
   */
  static async generateToken(
    patientId: string,
    input: CreateQrTokenInput
  ): Promise<{ token: string; expiresAt: string; label?: string }> {
    const db = getDb();
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);

    const hours = input.expiresInHours || 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    // Revoke existing active tokens for this patient so only the newest token is active
    await db
      .update(qrAccessTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(qrAccessTokens.patientId, patientId), isNull(qrAccessTokens.revokedAt)));

    await db.insert(qrAccessTokens).values({
      patientId,
      tokenHash,
      expiresAt,
      label: input.label || null,
    });

    return {
      token: rawToken,
      expiresAt: expiresAt.toISOString(),
      label: input.label || undefined,
    };
  }

  /**
   * Revokes all active QR tokens for the authenticated patient
   */
  static async revokeTokens(patientId: string): Promise<void> {
    const db = getDb();

    await db
      .update(qrAccessTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(qrAccessTokens.patientId, patientId), isNull(qrAccessTokens.revokedAt)));
  }

  /**
   * Public emergency lookup.
   * Validates token hash, writes an audit access log, and returns strictly emergency-approved fields.
   */
  static async getPublicEmergencyData(
    rawToken: string,
    meta: { ipAddress?: string; userAgent?: string }
  ): Promise<QrPublicEmergencyView | null> {
    const db = getDb();
    const tokenHash = hashToken(rawToken);
    const now = new Date();

    const activeTokens = await db
      .select()
      .from(qrAccessTokens)
      .where(
        and(
          eq(qrAccessTokens.tokenHash, tokenHash),
          isNull(qrAccessTokens.revokedAt),
          gt(qrAccessTokens.expiresAt, now)
        )
      )
      .limit(1);

    if (activeTokens.length === 0) {
      return null;
    }

    const tokenRecord = activeTokens[0];
    const patientId = tokenRecord.patientId;

    // Log the access attempt for security auditing
    await db.insert(qrAccessLogs).values({
      qrTokenId: tokenRecord.id,
      patientId,
      ipAddress: meta.ipAddress || null,
      userAgent: meta.userAgent || null,
    });

    // Query emergency-relevant patient info only
    const userRecords = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, patientId))
      .limit(1);

    const profileRecords = await db
      .select({
        emergencyContactName: patientProfiles.emergencyContactName,
        emergencyContactPhone: patientProfiles.emergencyContactPhone,
        emergencyContactRelationship: patientProfiles.emergencyContactRelationship,
      })
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, patientId))
      .limit(1);

    const medicalRecords = await db
      .select({
        bloodGroup: medicalDetails.bloodGroup,
        allergies: medicalDetails.allergies,
        chronicConditions: medicalDetails.chronicConditions,
        emergencyNotes: medicalDetails.emergencyNotes,
        organDonor: medicalDetails.organDonor,
      })
      .from(medicalDetails)
      .where(eq(medicalDetails.userId, patientId))
      .limit(1);

    const patientName = userRecords[0]?.name || 'Unknown Patient';
    const profile = profileRecords[0];
    const medical = medicalRecords[0];

    return {
      patientName,
      bloodGroup: medical?.bloodGroup || null,
      allergies: medical?.allergies || null,
      chronicConditions: medical?.chronicConditions || null,
      emergencyNotes: medical?.emergencyNotes || null,
      emergencyContactName: profile?.emergencyContactName || null,
      emergencyContactPhone: profile?.emergencyContactPhone || null,
      emergencyContactRelationship: profile?.emergencyContactRelationship || null,
      organDonor: medical?.organDonor || null,
    };
  }
}
