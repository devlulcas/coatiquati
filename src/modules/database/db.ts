import { env } from '@/env';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as commentSchema from './schema/comment';
import * as contentSchema from './schema/content';
import * as contributionSchema from './schema/contribution';
import * as emailVerificationTokenSchema from './schema/email-verification-token';
import * as passwordResetTokenSchema from './schema/password-reset-token';
import * as reportSchema from './schema/report';
import * as sensibleActionTokenSchema from './schema/sensible-action-token';
import * as topicSchema from './schema/topic';
import * as trailSchema from './schema/trail';
import * as trailSubscriptionSchema from './schema/trail-subscription';
import * as useSchema from './schema/user';

export const sqlite = new Database(env.DATABASE_URL);

export const db = drizzle(sqlite, {
  schema: {
    ...commentSchema,
    ...contentSchema,
    ...contributionSchema,
    ...emailVerificationTokenSchema,
    ...passwordResetTokenSchema,
    ...reportSchema,
    ...sensibleActionTokenSchema,
    ...topicSchema,
    ...trailSubscriptionSchema,
    ...trailSchema,
    ...useSchema,
  },
});

export type Database = typeof db;
