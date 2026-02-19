import { db } from '@/modules/database/db';
import type { FeedbackType } from '@/modules/database/lib/feedback-enum';
import { feedbacks, type InsertFeedback } from '@/modules/database/schema/feedback';
import { mapToPublicUser } from '@/modules/user/types/user';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import type { PaginationSchema } from '@/shared/schemas/pagination';
import type { SQL } from 'drizzle-orm';
import type { Feedback } from '../types/feedback';

export async function createFeedback(feedback: InsertFeedback): Promise<Result<number>> {
  try {
    const result = await db
      .insert(feedbacks)
      .values(feedback)
      .returning({ id: feedbacks.id })
      .then(result => result.at(0));

    if (typeof result === 'undefined') {
      return fail('Feedback não criado');
    }

    return ok(result.id);
  } catch (error) {
    console.error(error);
    return fail('Erro ao criar feedback');
  }
}

export async function getFeedbackList(pagination: PaginationSchema, type?: FeedbackType): Promise<Result<Feedback[]>> {
  const result = await wrapAsyncInResult(
    db.query.feedbacks.findMany({
      where: (fields, { and, eq, isNotNull }) => {
        const filters: SQL[] = [];

        if (type) {
          filters.push(eq(fields.type, type));
        }

        filters.push(isNotNull(fields.deletedAt));

        return and(...filters);
      },
      limit: pagination.take,
      offset: pagination.skip,
      with: {
        user: true,
      },
    }),
  );

  if (isFail(result)) {
    return result;
  }

  const feedbacks = result.value.map<Feedback>(feedback => ({
    ...feedback,
    user: mapToPublicUser(feedback.user),
  }));

  return ok(feedbacks);
}
