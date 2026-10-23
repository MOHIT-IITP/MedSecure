import { describe, it, expect } from 'vitest';
import { apiEnvSchema } from '@medsecure/validation';

describe('Environment Validation Schema', () => {
  it('should validate valid environment configuration', () => {
    const validConfig = {
      PORT: '4000',
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://postgres.test:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      JWT_SECRET: 'min-16-characters-secret-key-1234',
      DOCS_ORIGIN: 'http://localhost:3001',
      WEB_ORIGIN: 'http://localhost:3000',
      COOKIE_SECURE: 'false',
      ALLOW_OFFLINE_DEV: 'false',
    };

    const result = apiEnvSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(4000);
      expect(result.data.COOKIE_SECURE).toBe(false);
      expect(result.data.ALLOW_OFFLINE_DEV).toBe(false);
    }
  });

  it('should fail when JWT_SECRET is shorter than 16 characters', () => {
    const invalidConfig = {
      PORT: '4000',
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://postgres.test:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      JWT_SECRET: 'short',
      DOCS_ORIGIN: 'http://localhost:3001',
      WEB_ORIGIN: 'http://localhost:3000',
    };

    const result = apiEnvSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('JWT_SECRET'));
      expect(issue).toBeDefined();
    }
  });

  it('should fail when DATABASE_URL is missing in production/dev without offline flag', () => {
    const missingDbConfig = {
      PORT: '4000',
      NODE_ENV: 'production',
      JWT_SECRET: 'min-16-characters-secret-key-1234',
      DOCS_ORIGIN: 'http://localhost:3001',
      WEB_ORIGIN: 'http://localhost:3000',
      ALLOW_OFFLINE_DEV: 'false',
    };

    const result = apiEnvSchema.safeParse(missingDbConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('DATABASE_URL'));
      expect(issue).toBeDefined();
    }
  });

  it('should permit missing DATABASE_URL when ALLOW_OFFLINE_DEV is true', () => {
    const offlineConfig = {
      PORT: '4000',
      NODE_ENV: 'development',
      JWT_SECRET: 'min-16-characters-secret-key-1234',
      DOCS_ORIGIN: 'http://localhost:3001',
      WEB_ORIGIN: 'http://localhost:3000',
      ALLOW_OFFLINE_DEV: 'true',
    };

    const result = apiEnvSchema.safeParse(offlineConfig);
    expect(result.success).toBe(true);
  });
});
