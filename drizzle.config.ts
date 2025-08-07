import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const parsedUrl = new URL(DATABASE_URL);

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port),
    user: parsedUrl.username,
    password: parsedUrl.password,
    database: parsedUrl.pathname.slice(1),
    ssl: false, // 👈 DISABLE SSL here
  },
} satisfies Config;
