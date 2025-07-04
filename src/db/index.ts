import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const client = postgres(process.env.DATABASE_URL, {
  max: process.env.DB_MIGRATING ? 1 : undefined,
});

const db = drizzle(client, {
  casing: "snake_case",
  schema,
});

export default db;
