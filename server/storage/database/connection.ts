import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Force use of Supabase database only
if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL must be set");
}

const databaseUrl = process.env.SUPABASE_DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool);
