import pg from 'pg';
import { config } from './index.js';

const { Pool } = pg;

/**
 * PostgreSQL Connection Pool Configuration
 * Optimized for 100+ concurrent students with connection reuse.
 */
export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  max: 25, // Maximum number of clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Pool lifecycle listeners
pool.on('connect', () => {
  if (!config.isProduction) {
    // console.log('[DATABASE] Client connection allocated from pool');
  }
});

pool.on('error', (err) => {
  console.error('[DATABASE POOL ERROR]: Unexpected idle client error:', err.message);
});

/**
 * Standard Query Helper
 * Executes SQL statement with parameter binding.
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (!config.isProduction && duration > 200) {
      console.warn(`[SLOW QUERY] ${duration}ms: ${text}`);
    }
    return res;
  } catch (error) {
    console.error(`[QUERY ERROR]: ${error.message} | Query: ${text}`);
    throw error;
  }
};

/**
 * Diagnostic & Health Check Probe
 * Executes lightweight ping to evaluate database connectivity and latency.
 */
export const checkDbConnection = async () => {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT 1 AS health');
    const latencyMs = Date.now() - start;
    return {
      isConnected: true,
      latencyMs,
      database: config.db.name,
      host: config.db.host
    };
  } catch (err) {
    return {
      isConnected: false,
      error: err.message,
      database: config.db.name,
      host: config.db.host
    };
  }
};
