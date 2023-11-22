import { redirect } from 'next/navigation';
import { type roles } from '../constants/roles';
import { getPageSession } from './get-page-session';

type ProtectWithRedirectParams = {
  redirectTo?: string;
  acceptRoles?: Array<(typeof roles)[keyof typeof roles]>;
};

export async function protectWithRedirect({ acceptRoles, redirectTo }: ProtectWithRedirectParams) {
  const session = await getPageSession();

  if (!session) {
    redirect(redirectTo || '/sign-in');
  }

  if (acceptRoles && !acceptRoles.includes(session.user.role)) {
    redirect(redirectTo || '/sign-in');
  }

  return session;
}
