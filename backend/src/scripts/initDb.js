import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runDatabaseInit = async () => {
  console.log('🚀 Starting Quiziverse Database Initialization...');

  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

  try {
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    console.log('📖 Reading schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('⚙️ Applying schema (tables, foreign keys, and indexes)...');
    await pool.query(schemaSql);
    console.log('✅ Schema applied successfully!');

    if (fs.existsSync(seedPath)) {
      console.log('📖 Reading seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      console.log('🌱 Populating initial seed data (users, quizzes, achievements)...');
      await pool.query(seedSql);
      console.log('✅ Seed data populated successfully!');
    }

    console.log(`
  🎉 ====================================================
  🎉  QUIZIVERSE DATABASE SCHEMA & SEED READY!
  🎉 ====================================================
  ✅  Tables created : users, quizzes, questions, options, attempts, answers, achievements
  ✅  Indexes active : Leaderboards, Catalogs, Attempt Histories
  ====================================================
    `);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Hint: Ensure PostgreSQL server is running and credentials in backend/.env match.');
    }
  } finally {
    await pool.end();
  }
};

runDatabaseInit();
