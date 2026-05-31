import {

  pgTable,

  uuid,

  varchar,

  timestamp,

  text,

} from "drizzle-orm/pg-core";

import { users }
from "./user";

export const healthRecords =
  pgTable("health_records", {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId:
      uuid("user_id")
        .references(
          () => users.id
        )
        .notNull(),

    bloodPressure:
      varchar(
        "blood_pressure",
        {
          length:50,
        }
      ),

    sugarLevel:
      varchar(
        "sugar_level",
        {
          length:50,
        }
      ),

    weight:
      varchar(
        "weight",
        {
          length:50,
        }
      ),

    pulse:
      varchar(
        "pulse",
        {
          length:50,
        }
      ),

    notes:
      text("notes"),

    createdAt:
      timestamp(
        "created_at"
      )
        .defaultNow()
        .notNull(),
});