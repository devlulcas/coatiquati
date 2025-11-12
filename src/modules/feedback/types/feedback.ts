import type { SelectFeedback } from '@/modules/database/schema/feedback';
import type { PublicUser } from '@/modules/user/types/user';
import type { With } from '@/shared/utils/with';

export type Feedback = With<SelectFeedback, 'user', PublicUser>;
