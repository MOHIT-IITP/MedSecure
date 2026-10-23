import { eq } from 'drizzle-orm';
import { getDb, medicalDetails } from '@medsecure/db';
import { UpdateMedicalDetailsInput } from '@medsecure/validation';
import { MedicalDetailsData } from '@medsecure/types';

export class MedicalDetailsService {
  /**
   * Retrieves medical details for the authenticated user
   */
  static async getDetails(userId: string): Promise<MedicalDetailsData> {
    const db = getDb();

    const records = await db
      .select()
      .from(medicalDetails)
      .where(eq(medicalDetails.userId, userId))
      .limit(1);

    if (records.length === 0) {
      // Auto-create blank record if not present
      const inserted = await db
        .insert(medicalDetails)
        .values({ userId })
        .returning();

      return this.formatDetails(inserted[0]);
    }

    return this.formatDetails(records[0]);
  }

  /**
   * Updates medical details strictly scoped to authenticated user ID
   */
  static async updateDetails(
    userId: string,
    input: UpdateMedicalDetailsInput
  ): Promise<MedicalDetailsData> {
    const db = getDb();

    // Ensure record exists
    await this.getDetails(userId);

    const updated = await db
      .update(medicalDetails)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(medicalDetails.userId, userId))
      .returning();

    return this.formatDetails(updated[0]);
  }

  private static formatDetails(raw: typeof medicalDetails.$inferSelect): MedicalDetailsData {
    return {
      id: raw.id,
      userId: raw.userId,
      bloodGroup: raw.bloodGroup,
      allergies: raw.allergies,
      medications: raw.medications,
      chronicConditions: raw.chronicConditions,
      organDonor: raw.organDonor,
      emergencyNotes: raw.emergencyNotes,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  }
}
