// src/db/index.ts
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
  var _dbOfflineFlag: boolean | undefined;
  var _dbOfflineLogged: boolean | undefined;
}

export const isDatabaseConfigured = Boolean(
  process.env.SQL_HOST && process.env.SQL_DB_NAME
);

if (global._dbOfflineFlag === undefined) {
  global._dbOfflineFlag = !isDatabaseConfigured;
}

export function isDbOnline(): boolean {
  return !global._dbOfflineFlag;
}

export function markDbOffline(err?: unknown): void {
  global._dbOfflineFlag = true;
  if (!global._dbOfflineLogged) {
    global._dbOfflineLogged = true;
    const reason =
      err instanceof Error ? err.message : 'PostgreSQL not configured';
    console.info(
      `[Safi Clinic] Running with in-memory clinical data store (${reason}).`
    );
  }
}

export const createPool = (): Pool | null => {
  if (!isDatabaseConfigured) {
    return null;
  }
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 3000,
    });

    global._postgresPool.on('error', (err) => {
      markDbOffline(err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db: NodePgDatabase<typeof schema> = pool
  ? drizzle(pool, { schema })
  : (null as unknown as NodePgDatabase<typeof schema>);
