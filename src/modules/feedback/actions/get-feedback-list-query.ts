'use server';

import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { FeedbackRepository } from '../repositories/feedback-repository';
import { FEEDBACK_TYPES, type Feedback, type FeedbackType } from '../types/feedback';

export async function getFeedbackListQuery(page: number, type?: string): Promise<Result<Feedback[]>> {
  const feedbackRepository = new FeedbackRepository();

  let feedbackType: FeedbackType | undefined;

  // Muitos casts porque o TS é paia e não consegue inferir o tipo de Array.includes
  if (type && FEEDBACK_TYPES.includes(type as FeedbackType)) {
    feedbackType = type as FeedbackType;
  }

  try {
    const feedbackList = await feedbackRepository.getFeedbackList({ take: 10, skip: (page - 1) * 10 }, feedbackType);
    return ok(feedbackList);
  } catch (error) {
    log.error('Falha ao buscar feedbacks.', String(error));
    return fail('Falha ao buscar feedbacks.');
  }
}
