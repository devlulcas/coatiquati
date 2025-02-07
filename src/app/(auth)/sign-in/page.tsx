import { SignInForm } from '@/modules/auth/components/sign-in-form';
import { validateRequest } from '@/modules/auth/services/lucia';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { session } = await validateRequest();
  if (session) redirect('/');

  return <SignInForm />;
}
