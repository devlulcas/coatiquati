import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from '../lib/auth';
import type { Session, SessionData, User } from '../lib/auth-client';

export const validateRequest = cache(
  async (): Promise<{ data: SessionData; user: User } | null> => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session === null) return null;

    return {
      data: session.session,
      user: session.user,
    };
  }
);

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await validateRequest();
  return session?.user ?? null;
});

export function assertAuthenticated<
  T extends Session | SessionData | User | null
>(data: T): asserts data is NonNullable<T> {
  if (data === null) {
    redirect('/sign-in?reason=unauthorized');
  }
}
