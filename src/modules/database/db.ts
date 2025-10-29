import { env } from '@/env';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { schema } from './schema';

const sqlite = new Database(env.DATABASE_URL);

export const db = drizzle(sqlite, { schema });

type Database = typeof db;
export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
