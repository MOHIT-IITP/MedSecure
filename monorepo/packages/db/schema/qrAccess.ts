import {

  pgTable,

  uuid,

  varchar,

  timestamp,

} from "drizzle-orm/pg-core";

import { users }
from "./user";

export const qrAccess =
  pgTable("qr_access", {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId:
      uuid("user_id")
        .references(
          () => users.id
        )
        .notNull()
        .unique(),

    token:
      varchar(
        "token",
        {
          length:255,
        }
      )
        .notNull()
        .unique(),

    createdAt:
      timestamp(
        "created_at"
      )
        .defaultNow()
        .notNull(),
});