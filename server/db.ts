// /server/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm'; // ✅ correct import for sql helper
import { Pool } from 'pg';
import * as schema from './schema'; 
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL must be set in your .env file');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

export const db = drizzle(pool, { schema });
export { pool, sql };
