import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { AVATARS } from '../../../modules/user/constants/avatars';
import { yolo } from '../../../shared/lib/yolo';
import type { Role } from '../../auth/constants/roles';
import { tableTimestampColumns } from '../lib/helpers';
import { commentVoteTable } from './comment';
import {
  contentContributionTable,
  topicContributionTable,
  trailContributionTable,
} from './contribution';
import { emailVerificationTokenTable } from './email-verification-token';
import { passwordResetTokenTable } from './password-reset-token';
import { publicationTable } from './publication';
import { trailTable } from './trail';
import { trailSubscriptionTable } from './trail-subscription';
import { userFollowerTable } from './user-follower';

export type AuthUserTable = typeof userTable.$inferSelect;

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').$type<Role>().notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar').notNull().default(yolo.getRandomItem(AVATARS)),
  verifiedAt: timestamp('verified_at'),
  bannedAt: timestamp('banned_at'),
  ...tableTimestampColumns,
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  emailVerificationTokens: many(emailVerificationTokenTable),
  passwordResetTokens: many(passwordResetTokenTable),
  trailSubscriptions: many(trailSubscriptionTable),
  authoredTrails: many(trailTable),
  authoredTopics: many(trailTable),
  trailContributions: many(trailContributionTable),
  topicContributions: many(topicContributionTable),
  contentContributions: many(contentContributionTable),
  commentVotes: many(commentVoteTable),
  followers: many(userFollowerTable, { relationName: 'following' }),
  following: many(userFollowerTable, { relationName: 'followers' }),
  publications: many(publicationTable),
}));
