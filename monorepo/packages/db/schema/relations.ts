import { relations } from "drizzle-orm";
import { users } from "./user";
import { reports } from "./report";
import { healthRecords } from "./healthRecord";
import { qrAccess } from "./qrAccess";

export const usersRelations = relations(users, ({ one, many }) => ({
  qrAccess: one(qrAccess),
  reports: many(reports),
  healthRecords: many(healthRecords),
}));

export const qrAccessRelations = relations(qrAccess, ({ one }) => ({
  user: one(users, {
    fields: [qrAccess.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  user: one(users, {
    fields: [healthRecords.userId],
    references: [users.id],
  }),
}));
