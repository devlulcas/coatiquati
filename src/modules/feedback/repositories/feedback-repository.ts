import { db } from '@/modules/database/db';
import { feedbackTable, type FeedbackInsert } from '@/modules/database/schema/feedback';
import type { PaginationSchema } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import type { Feedback, FeedbackType } from '../types/feedback';

export class FeedbackRepository {
  async createFeedback(feedback: FeedbackInsert): Promise<void> {
    try {
      await db.insert(feedbackTable).values(feedback).returning({ id: feedbackTable.id }).get();
    } catch (error) {
      log.error('Erro ao criar feedback', { error, feedback });
      throw new Error('Erro ao criar feedback');
    }
  }

  async getFeedback(pagination: PaginationSchema, type?: FeedbackType): Promise<Feedback[]> {
    return db.query.feedbackTable.findMany({
      where: (fields, operators) => (type ? operators.eq(fields.type, type) : operators.isNotNull(fields.deletedAt)),
      limit: pagination.take,
      offset: pagination.skip,
      with: {
        user: true,
      },
    });
  }
}
