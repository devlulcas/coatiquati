import Database from 'better-sqlite3';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { schema } from './schema';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

const sqlite = new Database(DATABASE_URL);

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

function migrateDatabase() {
  const migrationFolderPath = path.resolve(__dirname, '../../../drizzle');
  migrate(db, { migrationsFolder: migrationFolderPath });
  sqlite.close();
}

migrateDatabase();
