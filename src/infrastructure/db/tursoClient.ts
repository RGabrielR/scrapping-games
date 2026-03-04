import { createClient, type Client } from "@libsql/client";

export const db: Client | null =
  process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
    ? createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
    : null;
