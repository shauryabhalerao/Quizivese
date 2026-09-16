import { checkDbConnection, pool } from '../config/db.js';

const testConnection = async () => {
  console.log('🔍 Testing connection to Quiziverse database...');
  const result = await checkDbConnection();

  if (result.isConnected) {
    console.log(`
  ✅ Database Connection SUCCESSFUL!
  ---------------------------------
  Host     : ${result.host}
  Database : ${result.database}
  Latency  : ${result.latencyMs}ms
  Status   : Connected and accepting queries.
    `);
  } else {
    console.error(`
  ⚠️ Database Connection FAILED
  ----------------------------
  Target Host : ${result.host}
  Database    : ${result.database}
  Error       : ${result.error}

  💡 Troubleshooting Guide:
  1. Verify PostgreSQL is installed and running on your Mac.
  2. Check your backend/.env settings (DB_USER, DB_PASSWORD, DB_NAME, DB_PORT).
  3. Ensure the database '${result.database}' has been created (e.g. 'createdb ${result.database}').
    `);
  }

  await pool.end();
};

testConnection();
