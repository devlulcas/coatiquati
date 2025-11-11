import type { SelectReport } from '@/modules/database/schema/report';
import type { PublicUser } from '@/modules/user/types/user';

export type Report = SelectReport & {
  reportedBy: PublicUser;
  reportedUser: PublicUser;
};
