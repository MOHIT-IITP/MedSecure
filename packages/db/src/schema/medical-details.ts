import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const medicalDetails = pgTable(
  'medical_details',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    bloodGroup: varchar('blood_group', { length: 10 }),
    allergies: varchar('allergies', { length: 1000 }),
    medications: varchar('medications', { length: 1000 }),
    chronicConditions: varchar('chronic_conditions', { length: 1000 }),
    organDonor: varchar('organ_donor', { length: 10 }).default('no'),
    emergencyNotes: varchar('emergency_notes', { length: 1000 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('medical_details_user_id_idx').on(table.userId),
  ]
);

export type MedicalDetails = typeof medicalDetails.$inferSelect;
export type NewMedicalDetails = typeof medicalDetails.$inferInsert;
