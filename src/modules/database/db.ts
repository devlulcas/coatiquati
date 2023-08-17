import { env } from '@/env';
import Database from 'better-sqlite3';
import {
  drizzle,
  type BetterSQLite3Database,
} from 'drizzle-orm/better-sqlite3';

export const sqlite = new Database(env.DATABASE_URL);

export const db: BetterSQLite3Database = drizzle(sqlite);
