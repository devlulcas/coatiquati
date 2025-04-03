import { redirect } from 'next/navigation';
import { type roles } from '../constants/roles';
import { validateRequest } from '../services/next';

type ProtectWithRedirectParams = {
  redirectTo?: string;
  acceptRoles?: Array<(typeof roles)[keyof typeof roles]>;
};

export async function protectWithRedirect({ acceptRoles, redirectTo }: ProtectWithRedirectParams) {
  const { data: user } = await validateRequest();

  if (!user) {
    redirect(redirectTo || '/sign-in');
  }

  if (acceptRoles && !acceptRoles.includes(user.role)) {
    redirect(redirectTo || '/sign-in');
  }

  return user;
}
