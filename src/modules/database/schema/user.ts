import { relations, type InferSelectModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Role } from '../../auth/constants/roles';
import { tableTimestampColumns } from '../lib/helpers';
import { commentVoteTable } from './comment';
import { contentContributionTable, topicContributionTable, trailContributionTable } from './contribution';
import { emailVerificationTokenTable } from './email-verification-token';
import { passwordResetTokenTable } from './password-reset-token';
import { publicationTable } from './publication';
import { trailTable } from './trail';
import { trailSubscriptionTable } from './trail-subscription';
import { userFollowerTable } from './user-follower';

export type AuthUserTable = InferSelectModel<typeof userTable>;

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').$type<Role>().notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar').notNull().default('/avatars/original.png'),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  bannedAt: integer('banned_at', { mode: 'timestamp' }),
  ...tableTimestampColumns,
});

export const userTableRelations = relations(userTable, ({ one, many }) => ({
  emailVerificationTokens: many(emailVerificationTokenTable),
  passwordResetTokens: many(passwordResetTokenTable),
  trailSubscriptions: many(trailSubscriptionTable),
  authoredTrails: many(trailTable),
  authoredTopics: many(trailTable),
  trailContributions: many(trailContributionTable),
  topicContributions: many(topicContributionTable),
  contentContributions: many(contentContributionTable),
  commentVotes: many(commentVoteTable),
  followers: many(userFollowerTable, { relationName: 'followed' }),
  following: many(userFollowerTable, { relationName: 'follower' }),
  publications: many(publicationTable),
}));

export const sessionTable = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires_at: blob('expires_at', { mode: 'bigint' }).notNull(),
});
