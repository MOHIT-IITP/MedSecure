import { eq, desc, sql } from 'drizzle-orm';
import { getDb, healthLogs, users } from '@medsecure/db';
import { CreateHealthLogInput, HealthLogQueryInput } from '@medsecure/validation';
import { HealthLogData, HealthLogEntryType, PaginatedResult } from '@medsecure/types';

export class HealthLogsService {
  /**
   * Retrieves paginated health logs for a patient
   */
  static async getPatientLogs(
    patientId: string,
    query: HealthLogQueryInput
  ): Promise<PaginatedResult<HealthLogData>> {
    const db = getDb();
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const offset = (page - 1) * limit;

    // Count total items
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(healthLogs)
      .where(eq(healthLogs.patientId, patientId));

    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch items with author details
    const records = await db
      .select({
        log: healthLogs,
        authorName: users.name,
        authorRole: users.role,
      })
      .from(healthLogs)
      .leftJoin(users, eq(healthLogs.authorId, users.id))
      .where(eq(healthLogs.patientId, patientId))
      .orderBy(desc(healthLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const items: HealthLogData[] = records.map(({ log, authorName, authorRole }) => ({
      id: log.id,
      patientId: log.patientId,
      authorId: log.authorId,
      authorName: authorName || undefined,
      authorRole: authorRole || undefined,
      entryType: log.entryType as HealthLogEntryType,
      title: log.title,
      content: log.content,
      vitals: log.vitals,
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : String(log.createdAt),
      updatedAt: log.updatedAt instanceof Date ? log.updatedAt.toISOString() : String(log.updatedAt),
    }));

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Creates a new health log entry
   */
  static async createLog(
    patientId: string,
    authorId: string,
    authorRole: string,
    input: CreateHealthLogInput
  ): Promise<HealthLogData> {
    const db = getDb();

    // Patients can only author patient_notes. Doctors author doctor_consultation logs.
    const entryType: HealthLogEntryType =
      authorRole === 'doctor' ? 'doctor_consultation' : 'patient_note';

    const inserted = await db
      .insert(healthLogs)
      .values({
        patientId,
        authorId,
        entryType,
        title: input.title,
        content: input.content,
        vitals: input.vitals || null,
      })
      .returning();

    const created = inserted[0];

    return {
      id: created.id,
      patientId: created.patientId,
      authorId: created.authorId,
      authorRole,
      entryType: created.entryType as HealthLogEntryType,
      title: created.title,
      content: created.content,
      vitals: created.vitals,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }
}
