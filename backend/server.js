import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
  🌌 ===================================================
  🌌  QUIZIVERSE REST API ENGINE — ONLINE
  🌌 ===================================================
  🚀  Server Port    : http://localhost:${PORT}
  🔍  Health Check   : http://localhost:${PORT}/api/health
  📚  API Base       : http://localhost:${PORT}/api
  🛡️   Environment   : ${config.nodeEnv}
  👥  Capacity       : 100+ Concurrent Students
  ===================================================
  `);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Signal received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[SHUTDOWN] HTTP server closed cleanly. Process terminating.');
    process.exit(0);
  });

  // Force shutdown if connections do not close within 10 seconds
  setTimeout(() => {
    console.error('[FORCE SHUTDOWN] Could not close connections in time, forcing shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT EXCEPTION]:', error);
  process.exit(1);
});
