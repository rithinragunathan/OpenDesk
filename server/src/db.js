import pkg from 'pg';
import { config } from './config.js';

const { Pool } = pkg;

export const pool = new Pool({ connectionString: config.databaseUrl });

export async function initializeDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(128) UNIQUE,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(160) UNIQUE NOT NULL,
      password_hash TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(140) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(40) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      status VARCHAR(20) DEFAULT 'open',
      created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
