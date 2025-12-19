import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { VoteValue } from '../lib/vote-value-enum';
import { user } from './auth';
import { comments } from './comment';
import { contents } from './content';
import { publications } from './publication';
import { topics } from './topic';
import { trails } from './trail';

export type SelectCommentVote = typeof votes.$inferSelect;
export type InsertCommentVote = typeof votes.$inferInsert;

const voteValueCheck = sql`value IS NULL OR value IN (${VoteValue.UPVOTE}, ${VoteValue.DOWNVOTE})`;

const onlyOneTargetCheck = sql`(
  (trail_id IS NOT NULL)::int +
  (topic_id IS NOT NULL)::int +
  (content_id IS NOT NULL)::int +
  (publication_id IS NOT NULL)::int
) = 1`;

export const votes = t.pgTable(
  'vote',
  {
    id: t.serial('id').primaryKey(),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    value: t.smallint('value').$type<VoteValue | null>(),

    // Target
    trailId: t.integer('trail_id').references(() => trails.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    topicId: t.integer('topic_id').references(() => topics.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    contentId: t.integer('content_id').references(() => contents.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    publicationId: t.integer('publication_id').references(() => publications.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    commentId: t.integer('comment_id').references(() => comments.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    ...tableTimestampColumns,
  },
  table => [
    t
      .uniqueIndex('user_vote_target_unique_idx')
      .on(table.userId, table.trailId, table.topicId, table.contentId, table.publicationId, table.commentId),
    t.check('value_check', voteValueCheck),
    t.check('only_one_target_check', onlyOneTargetCheck),
  ],
);

export const commentVotesRelations = relations(votes, ({ one }) => ({
  user: one(user, {
    fields: [votes.userId],
    references: [user.id],
    relationName: 'comment_vote_user',
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
    relationName: 'comment_vote',
  }),
  trail: one(trails, {
    fields: [votes.trailId],
    references: [trails.id],
    relationName: 'trail_vote',
  }),
  topic: one(topics, {
    fields: [votes.topicId],
    references: [topics.id],
    relationName: 'topic_vote',
  }),
  content: one(contents, {
    fields: [votes.contentId],
    references: [contents.id],
    relationName: 'content_vote',
  }),
  publication: one(publications, {
    fields: [votes.publicationId],
    references: [publications.id],
    relationName: 'publication_vote',
  }),
}));
