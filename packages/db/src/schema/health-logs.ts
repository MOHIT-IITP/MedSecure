import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const healthLogs = pgTable(
  'health_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    entryType: varchar('entry_type', { length: 50 }).default('patient_note').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('content', { length: 5000 }).notNull(),
    vitals: varchar('vitals', { length: 1000 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('health_logs_patient_created_idx').on(table.patientId, table.createdAt),
    index('health_logs_author_id_idx').on(table.authorId),
  ]
);

export type HealthLog = typeof healthLogs.$inferSelect;
export type NewHealthLog = typeof healthLogs.$inferInsert;
