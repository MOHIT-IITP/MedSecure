import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { apiEnvSchema, ApiEnv } from '@medsecure/validation';

/**
 * Loads .env from apps/api/.env or monorepo root .env
 */
function loadEnvFile(): void {
  const envPaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return;
    }
  }

  // Fallback to default dotenv lookup
  dotenv.config();
}

loadEnvFile();

function validateEnv(): ApiEnv {
  const parseResult = apiEnvSchema.safeParse(process.env);

  if (!parseResult.success) {
    const formattedErrors = parseResult.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    const errorMessage = [
      '=================================================================',
      ' [ERROR] Invalid or Missing Environment Variables for MedSecure API:',
      formattedErrors,
      '=================================================================',
      ' Please copy apps/api/.env.example to apps/api/.env and provide valid configuration.',
      ' For offline local development, you may set ALLOW_OFFLINE_DEV=true.',
      '=================================================================',
    ].join('\n');

    // In test environment, throw Error instead of process.exit so test runner can catch
    if (process.env.NODE_ENV === 'test') {
      throw new Error(errorMessage);
    }

    console.error(errorMessage);
    process.exit(1);
  }

  return parseResult.data;
}

export const env = validateEnv();
