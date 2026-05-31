import {

  pgTable,

  uuid,

  varchar,

  timestamp,

} from "drizzle-orm/pg-core";

import { users }
from "./user";

export const reports =
  pgTable("reports", {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId:
      uuid("user_id")
        .references(
          () => users.id
        )
        .notNull(),

    title:
      varchar(
        "title",
        {
          length:255,
        }
      ).notNull(),

    fileUrl:
      varchar(
        "file_url",
        {
          length:1000,
        }
      ).notNull(),

    fileType:
      varchar(
        "file_type",
        {
          length:100,
        }
      ).notNull(),

    uploadedAt:
      timestamp(
        "uploaded_at"
      )
        .defaultNow()
        .notNull(),
});