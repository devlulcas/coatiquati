import { redirect } from 'next/navigation';
import { roles } from '../constants/roles';
import { getPageSession } from './get-page-session';

type ProtectWithRedirectParams = {
  redirectTo?: string;
  acceptRoles?: Array<(typeof roles)[keyof typeof roles]>;
};

export async function protectWithRedirect({
  acceptRoles,
  redirectTo,
}: ProtectWithRedirectParams) {
  const session = await getPageSession();

  if (!session) {
    redirect(redirectTo || '/sign-in');
  }

  const userRole = session.user.role === roles.ADMIN ? roles.ADMIN : roles.USER;

  if (acceptRoles && !acceptRoles.includes(userRole)) {
    redirect(redirectTo || '/sign-in');
  }

  return session;
}
