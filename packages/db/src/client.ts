import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

export interface DbConnectionOptions {
  connectionString?: string;
  max?: number;
}

/**
 * Initializes and retrieves the Drizzle ORM database instance.
 *
 * Supabase Connection Types:
 * 1. Runtime Application Pooler (Port 6543):
 *    Recommended for application runtime (e.g. Express / Serverless).
 *    Uses Supavisor/PgBouncer pooler. Requires `prepare: false` in postgres-js
 *    to avoid prepared statement conflicts across shared pooler connections.
 *
 * 2. Direct Connection (Port 5432):
 *    Recommended for DDL schema migrations (drizzle-kit migrate/push).
 */
export function getDb(connectionString?: string): PostgresJsDatabase<typeof schema> {
  if (dbInstance) {
    return dbInstance;
  }

  const connStr = connectionString || process.env.DATABASE_URL;

  if (!connStr) {
    throw new Error('Database connection string is missing. Ensure DATABASE_URL is set.');
  }

  // Use prepare: false for compatibility with connection poolers (PgBouncer / Supavisor)
  client = postgres(connStr, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 5,
    prepare: false,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

/**
 * Checks database connectivity with a lightweight ping (SELECT 1).
 * Safe to call from health/readiness endpoints with a quick timeout.
 */
export async function checkDatabaseConnection(
  connectionString?: string
): Promise<{ connected: boolean; error?: string }> {
  const connStr = connectionString || process.env.DATABASE_URL;

  if (!connStr) {
    return {
      connected: false,
      error: 'DATABASE_URL environment variable is not configured',
    };
  }

  let probeClient: postgres.Sql | null = null;
  try {
    probeClient = postgres(connStr, {
      max: 1,
      connect_timeout: 3,
      idle_timeout: 5,
      prepare: false,
    });

    await probeClient`SELECT 1`;
    return { connected: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { connected: false, error: message };
  } finally {
    if (probeClient) {
      await probeClient.end({ timeout: 2 }).catch(() => {});
    }
  }
}

/**
 * Closes the active database connection pool.
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.end({ timeout: 5 });
    client = null;
    dbInstance = null;
  }
}
