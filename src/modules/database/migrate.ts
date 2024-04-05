import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';
import * as commentSchema from './schema/comment';
import * as contentSchema from './schema/content';
import * as contributionSchema from './schema/contribution';
import * as emailVerificationTokenSchema from './schema/email-verification-token';
import * as feedbackSchema from './schema/feedback';
import * as passwordResetTokenSchema from './schema/password-reset-token';
import * as reportSchema from './schema/report';
import * as topicSchema from './schema/topic';
import * as trailSchema from './schema/trail';
import * as trailSubscriptionSchema from './schema/trail-subscription';
import * as useSchema from './schema/user';

config({
  path: '.env.local',
});

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
if (!DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN is not defined');
}

export const sqlite = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(sqlite, {
  schema: {
    ...commentSchema,
    ...contentSchema,
    ...contributionSchema,
    ...emailVerificationTokenSchema,
    ...passwordResetTokenSchema,
    ...reportSchema,
    ...topicSchema,
    ...trailSubscriptionSchema,
    ...trailSchema,
    ...useSchema,
    ...feedbackSchema,
  },
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
