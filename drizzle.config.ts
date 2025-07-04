import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from 'drizzle-kit';

// Load and expand environment variables
expand(config());

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: "snake_case",
});