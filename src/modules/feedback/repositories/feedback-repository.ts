import { db } from '@/modules/database/db';
import { feedbackTable, type NewFeedback } from '@/modules/database/schema/feedback';
import { userTable } from '@/modules/database/schema/user';
import type { PaginationSchema } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { desc, eq } from 'drizzle-orm';
import type { Feedback } from '../types/feedback';

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

  async getFeedback(pagination: PaginationSchema, type?: string, database = db): Promise<Feedback[]> {
    let feedbackQuery = database
      .select({
        id: feedbackTable.id,
        type: feedbackTable.type,
        softwareVersion: feedbackTable.softwareVersion,
        text: feedbackTable.content,
        createdAt: feedbackTable.createdAt,
        user: {
          id: userTable.id,
          username: userTable.username,
          avatar: userTable.avatar,
        },
      })
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt))
      .leftJoin(userTable, eq(feedbackTable.userId, userTable.id))
      .limit(pagination.take)
      .offset(pagination.skip);

    const isValidQueryType = (type: unknown): type is Feedback['type'] => {
      return typeof type === 'string' && ['bug', 'feature', 'improvement'].includes(type);
    };

    if (isValidQueryType(type)) {
      feedbackQuery = feedbackQuery.where(eq(feedbackTable.type, type));
    }

    const feedback = feedbackQuery.all();

    return feedback;
  }
}
