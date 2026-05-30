import dotenv from "dotenv";
import path from "path";

import postgres from "postgres";

import { drizzle }
from "drizzle-orm/postgres-js";

import * as schema
from "./schema";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    "../../.env"
  ),
});

const client =
  postgres(
    process.env.DATABASE_URL!
  );

export const db =
  drizzle(client,{
    schema,
  });

export * from "./schema";
