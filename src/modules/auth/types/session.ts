import type { SessionSelect } from '@/modules/database/schema/session';
import type { PublicUser } from '@/modules/user/types/user';

export type Session = SessionSelect;

export type PublicSession = {
  data: PublicUser & { sessionId: Session['id'] };
  status: 'authenticated';
} | {
  data: null;
  status: 'unauthenticated';
} | {
  data: null;
  status: 'idle';
};
