import type { FeedbackSelect } from '@/modules/database/schema/feedback';
import type { User } from '@/modules/user/types/user';
import type { With } from '@/shared/utils/with';

export type FeedbackType = 'bug' | 'feature' | 'improvement';

export type Feedback = With<FeedbackSelect, 'user', User>;
