'use server';

import { FeedbackRepository } from '../repositories/feedback-repository';
import type { Feedback } from '../types/feedback';

export async function getFeedbackListQuery(page: number, type?: string): Promise<Feedback[]> {
  const feedbackRepository = new FeedbackRepository();
  return feedbackRepository.getFeedback({ take: 10, skip: (page - 1) * 10 }, type);
}
