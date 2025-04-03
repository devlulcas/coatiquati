import type { User } from '@/modules/user/types/user';

export type CustomContext = {
  Variables: {
    currentUser: User;
  };
};
