import { app } from './app';
import { env } from './config/env';
import { closeDatabaseConnection } from '@medsecure/db';
import { Server } from 'http';

const port = env.PORT;

const server: Server = app.listen(port, () => {
  console.log(`[MedSecure API] Server running in ${env.NODE_ENV} mode on port ${port}`);
  console.log(`[MedSecure API] Health check: http://localhost:${port}/api/health`);
  console.log(`[MedSecure API] Readiness check: http://localhost:${port}/api/ready`);
});

// Graceful shutdown handler
async function handleShutdown(signal: string): Promise<void> {
  console.log(`\n[MedSecure API] Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('[MedSecure API] HTTP server closed.');

    try {
      await closeDatabaseConnection();
      console.log('[MedSecure API] Database connection closed.');
    } catch (err) {
      console.error('[MedSecure API] Error closing database connections:', err);
    }

    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('[MedSecure API] Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
