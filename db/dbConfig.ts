import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as wsDrizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL!,
});
export const wsDb = wsDrizzle(pool, {
  schema,
  logger: { logQuery: (query) => console.log("[WebSocket]", query) },
});

export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle(sql, {
  schema,
  logger: {
    logQuery: (query) => console.log("[HTTP]", query),
  },
});
