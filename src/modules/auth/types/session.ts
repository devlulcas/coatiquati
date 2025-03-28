import type { PublicUser } from '@/modules/user/types/user';
import { type Session as LuciaSession } from 'lucia';

export type Session = LuciaSession;

export type PublicSession = {
  data: PublicUser;
  status: 'authenticated';
} | {
  data: null;
  status: 'unauthenticated';
} | {
  data: null;
  status: 'idle';
};
