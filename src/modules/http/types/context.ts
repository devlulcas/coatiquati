import type { User } from '@/modules/auth/lib/auth-client';

export type CustomContext = {
  Variables: {
    currentUser: User;
  };
};
