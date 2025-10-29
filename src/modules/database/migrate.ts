import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import postgres from 'postgres';
import { schema } from './schema';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

const client = postgres(DATABASE_URL);

const db = drizzle(client, {
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
  await migrate(db, { migrationsFolder: migrationFolderPath });
  await client.end();
}

migrateDatabase();
