import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/forkcast";

let pool: Pool | undefined;

export function getDb() {
  pool ??= new Pool({ connectionString });
  return drizzle(pool);
}
