import { eq } from 'drizzle-orm';
import { getDb, patientProfiles } from '@medsecure/db';
import { UpdatePatientProfileInput } from '@medsecure/validation';
import { PatientProfileData } from '@medsecure/types';

export class PatientsService {
  /**
   * Retrieves profile for the authenticated patient
   */
  static async getProfile(userId: string): Promise<PatientProfileData> {
    const db = getDb();

    const records = await db
      .select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, userId))
      .limit(1);

    if (records.length === 0) {
      // Auto-create blank profile if not present
      const inserted = await db
        .insert(patientProfiles)
        .values({ userId })
        .returning();

      return this.formatProfile(inserted[0]);
    }

    return this.formatProfile(records[0]);
  }

  /**
   * Updates profile fields strictly scoped to authenticated user ID
   */
  static async updateProfile(
    userId: string,
    input: UpdatePatientProfileInput
  ): Promise<PatientProfileData> {
    const db = getDb();

    // Ensure record exists
    await this.getProfile(userId);

    const updated = await db
      .update(patientProfiles)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(patientProfiles.userId, userId))
      .returning();

    return this.formatProfile(updated[0]);
  }

  private static formatProfile(raw: typeof patientProfiles.$inferSelect): PatientProfileData {
    return {
      id: raw.id,
      userId: raw.userId,
      dateOfBirth: raw.dateOfBirth,
      gender: raw.gender,
      address: raw.address,
      emergencyContactName: raw.emergencyContactName,
      emergencyContactPhone: raw.emergencyContactPhone,
      emergencyContactRelationship: raw.emergencyContactRelationship,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  }
}
