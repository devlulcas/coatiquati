'use server';

import { db } from '@/modules/database/db';
import { user } from '@/modules/database/schema/auth';
import { comments } from '@/modules/database/schema/comment';
import { votes } from '@/modules/database/schema/vote';
import { ok, type Result } from '@/shared/lib/result';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import type { Comment } from '../types/comment';

export async function getCommentResponsesQuery(commentId: number): Promise<Result<Comment[]>> {
  const commentsResult = await db
    .select({
      id: comments.id,
      content: comments.content,
      contentId: comments.contentId,
      trailId: comments.trailId,
      topicId: comments.topicId,
      publicationId: comments.publicationId,
      parentCommentId: comments.parentCommentId,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.image,
      },
      repliesCount: db.$count(comments, and(eq(comments.parentCommentId, comments.id), isNull(comments.deletedAt))),
      votes: {
        up: db.$count(votes, and(eq(votes.commentId, comments.id), eq(votes.value, 1))),
        down: db.$count(votes, and(eq(votes.commentId, comments.id), eq(votes.value, -1))),
      },
    })
    .from(comments)
    .innerJoin(user, and(eq(comments.userId, user.id), eq(user.banned, false)))
    .leftJoin(votes, and(eq(comments.id, votes.commentId), isNotNull(votes.value)))
    .where(and(eq(comments.parentCommentId, commentId), isNull(comments.deletedAt)))
    .orderBy(desc(comments.createdAt))
    .groupBy(comments.id);

  return ok(commentsResult);
}
