import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const users =
  pgTable("users", {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    name: varchar("name",{
      length:255,
    }).notNull(),

    email: varchar("email",{
      length:255,
    })
      .unique()
      .notNull(),

    password: varchar(
      "password",
      {
        length:255,
      }
    ).notNull(),

    age: integer("age"),

    bloodGroup: varchar(
      "blood_group",
      {
        length:20,
      }
    ),

    allergies: text(
      "allergies"
    ),

    chronicDiseases:
      text(
        "chronic_diseases"
      ),

    emergencyContact:
      varchar(
        "emergency_contact",
        {
          length:30,
        }
      ),

    createdAt:
      timestamp(
        "created_at"
      )
        .defaultNow()
        .notNull(),

    updatedAt:
      timestamp(
        "updated_at"
      )
        .defaultNow()
        .notNull(),
});