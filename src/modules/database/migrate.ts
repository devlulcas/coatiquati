import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';
import { schema } from './schema';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not defined');

const sqlite = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

const db = drizzle(sqlite, {
  schema: schema,
  logger: {
    logQuery(query, params) {
      console.log(query, params);
    },
  },
});

export type Database = typeof db;
export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function migrateDatabase() {
  const migrationFolderPath = path.resolve(__dirname, '../../../drizzle');
  await migrate(db, { migrationsFolder: migrationFolderPath, migrationsTable: '__migrations_drizzle' });
  sqlite.close();
}

migrateDatabase();
