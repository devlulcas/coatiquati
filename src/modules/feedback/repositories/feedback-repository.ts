import { db } from '@/modules/database/db';
import { feedbackTable, type NewFeedback } from '@/modules/database/schema/feedback';
import type { PaginationSchema } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { desc, eq } from 'drizzle-orm';

export const FEEDBACK_DB_FIELDS = Object.freeze({
  id: true,
  title: true,
  description: true,
  thumbnail: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export class FeedbackRepository {
  async createFeedback(feedback: NewFeedback, database = db): Promise<number> {
    try {
      const newFeedback = database.insert(feedbackTable).values(feedback).returning({ id: feedbackTable.id }).get();
      return newFeedback.id;
    } catch (error) {
      log.error('Erro ao criar feedback', { error, feedback });
      throw new Error('Erro ao criar feedback');
    }
  }

  async getFeedback(pagination: PaginationSchema, type?: string, database = db) {
    const feedback = database
      .select()
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt))
      .where(type ? eq(feedbackTable.type, type) : undefined)
      .groupBy(feedbackTable.softwareVersion)
      .limit(pagination.take)
      .offset(pagination.skip)
      .all();

    return feedback;
  }
}
