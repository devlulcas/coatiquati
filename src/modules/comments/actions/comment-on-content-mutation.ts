'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import {
  comments,
  type InsertComment,
} from '@/modules/database/schema/comment';
import { toMS } from '@/shared/lib/date';
import { fail, ok, type Result } from '@/shared/lib/result';
import {
  newCommentSchema,
  type NewCommentSchema,
} from '../schemas/new-comment-schema';

export async function commentOnContentMutation(
  params: NewCommentSchema
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const parsed = newCommentSchema.safeParse(params);

  if (!parsed.success) {
    return fail('Parâmetros inválidos para criar um comentário.');
  }

  const TIMEOUT = toMS(60, 'secs');

  const lastCommentResult = await db.query.comments.findFirst({
    where: (fields, operators) => {
      return operators.and(
        operators.eq(fields.userId, user.id),
        operators.gt(fields.createdAt, new Date(Date.now() - TIMEOUT))
      );
    },
  });

  if (lastCommentResult) {
    return fail('Você deve esperar 60 segundos para comentar novamente');
  }

  const comment: InsertComment = {
    userId: user.id,
    content: params.content,
    parentCommentId: params.parentCommentId,
    trailId: params.trailId,
    topicId: params.topicId,
    contentId: params.contentId,
    publicationId: params.publicationId,
  };

  const newComment = await db
    .insert(comments)
    .values(comment)
    .returning({ id: comments.id })
    .then((result) => result.at(0));

  if (!newComment) {
    return fail('Erro ao criar comentário');
  }

  return ok('Comentário criado com sucesso');
}
