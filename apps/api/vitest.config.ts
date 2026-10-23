import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      PORT: '4001',
      DATABASE_URL: 'postgresql://postgres.mock:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      JWT_SECRET: 'test-jwt-secret-min-16-chars',
      DOCS_ORIGIN: 'http://localhost:3001',
      WEB_ORIGIN: 'http://localhost:3000',
      COOKIE_SECURE: 'false',
      ALLOW_OFFLINE_DEV: 'false',
    },
  },
});
