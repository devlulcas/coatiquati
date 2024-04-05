import type { FeedbackSelect } from '@/modules/database/schema/feedback';
import type { User } from '@/modules/user/types/user';
import type { With } from '@/shared/utils/with';

export const FEEDBACK_TYPES = ['bug', 'feature', 'improvement'] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export type Feedback = With<FeedbackSelect, 'user', User>;
