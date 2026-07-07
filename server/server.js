import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectDB, closeDB } from './src/config/db.js';

// 1. Establish connection to MongoDB instance
await connectDB();

// 2. Bind the Express HTTP server to the designated port
const server = app.listen(env.port, () => {
  console.log(`[Server] AI Stock Analyst Backend running in '${env.nodeEnv}' mode on port ${env.port}`);
});

// 3. Graceful termination handler (SIGTERM / SIGINT)
const gracefulShutdown = (signal) => {
  console.log(`[Server] ${signal} signal received. Commencing graceful shutdown...`);
  
  server.close(async () => {
    console.log('[Server] HTTP server stopped.');
    await closeDB();
    console.log('[Server] Graceful shutdown completed.');
    process.exit(0);
  });
  
  // Force exit after 10s if connections persist
  setTimeout(() => {
    console.error('[Server Warning] Forced shutdown due to persistent connections.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 4. Capture synchronous/asynchronous unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server Error] Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: In production, trigger gracefulShutdown or log to external APM
});

process.on('uncaughtException', (error) => {
  console.error('[Server Error] Uncaught Exception thrown:', error.message);
  if (error.stack) console.error(error.stack);
  
  // Exit immediately for safety on uncaught exception
  server.close(async () => {
    await closeDB();
    process.exit(1);
  });
});
