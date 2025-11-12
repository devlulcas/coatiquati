'use server';

import type { FeedbackType } from '@/modules/database/schema/feedback';
import type { Result } from '@/shared/lib/result';
import { getFeedbackList } from '../repositories/feedback-repository';
import type { Feedback } from '../types/feedback';

type GetFeedbackListQueryParams = {
  page: number;
  type?: FeedbackType;
};

export async function getFeedbackListQuery({
  page,
  type,
}: GetFeedbackListQueryParams): Promise<Result<Feedback[]>> {
  return getFeedbackList({ take: 10, skip: (page - 1) * 10 }, type);
}
