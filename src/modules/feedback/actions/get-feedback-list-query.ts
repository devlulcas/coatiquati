'use server';

import type { Feedback } from '@/modules/database/schema/feedback';
import { FeedbackRepository } from '../repositories/feedback-repository';

export async function getFeedbackListQuery(page: number, type?: string): Promise<Feedback[]> {
  const feedbackRepository = new FeedbackRepository();
  return feedbackRepository.getFeedback({ skip: (page - 1) * 10, take: 10 }, type);
}
