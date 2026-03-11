import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/forkcast";

// Supabase (and most hosted PG providers) require SSL.
// Locally (localhost) we skip SSL to avoid cert issues.
const isRemote = !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");

let pool: Pool | undefined;

export function getDb() {
  pool ??= new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : false
  });
  return drizzle(pool);
}
