import morgan from 'morgan';
import { config } from '../config/index.js';

/**
 * HTTP Request Logger using Morgan
 * In development: colorized concise format.
 * In production: Apache combined format for log analysis.
 */
export const requestLogger = morgan(
  config.isProduction ? 'combined' : 'dev',
  {
    skip: (req) => req.originalUrl === '/api/health' // Don't clutter logs with high-frequency health probes
  }
);
