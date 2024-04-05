'use server';

import { FeedbackRepository } from '../repositories/feedback-repository';
import { FEEDBACK_TYPES, type Feedback, type FeedbackType } from '../types/feedback';

export async function getFeedbackListQuery(page: number, type?: string): Promise<Feedback[]> {
  const feedbackRepository = new FeedbackRepository();

  let feedbackType: FeedbackType | undefined;

  // Muitos casts porque o TS é paia e não consegue inferir o tipo de Array.includes
  if (type && FEEDBACK_TYPES.includes(type as FeedbackType)) {
    feedbackType = type as FeedbackType;
  }

  return feedbackRepository.getFeedback({ take: 10, skip: (page - 1) * 10 }, feedbackType);
}
