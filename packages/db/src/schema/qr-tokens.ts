import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const qrAccessTokens = pgTable(
  'qr_access_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 255 }).unique().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    label: varchar('label', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('qr_tokens_patient_idx').on(table.patientId),
    index('qr_tokens_hash_idx').on(table.tokenHash),
  ]
);

export const qrAccessLogs = pgTable(
  'qr_access_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    qrTokenId: uuid('qr_token_id')
      .notNull()
      .references(() => qrAccessTokens.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ipAddress: varchar('ip_address', { length: 100 }),
    userAgent: varchar('user_agent', { length: 500 }),
    accessedAt: timestamp('accessed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('qr_logs_token_idx').on(table.qrTokenId),
    index('qr_logs_patient_idx').on(table.patientId),
  ]
);

export type QrAccessToken = typeof qrAccessTokens.$inferSelect;
export type NewQrAccessToken = typeof qrAccessTokens.$inferInsert;
export type QrAccessLog = typeof qrAccessLogs.$inferSelect;
export type NewQrAccessLog = typeof qrAccessLogs.$inferInsert;
