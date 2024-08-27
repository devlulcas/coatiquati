import { redirect } from 'next/navigation';
import { type roles } from '../constants/roles';
import { validateRequest } from '../services/lucia';

type ProtectWithRedirectParams = {
  redirectTo?: string;
  acceptRoles?: Array<(typeof roles)[keyof typeof roles]>;
};

export async function protectWithRedirect({ acceptRoles, redirectTo }: ProtectWithRedirectParams) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect(redirectTo || '/sign-in');
  }

  if (acceptRoles && !acceptRoles.includes(user.role)) {
    redirect(redirectTo || '/sign-in');
  }

  return user;
}
