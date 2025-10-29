import { redirect } from 'next/navigation';
import { SignUpForm } from '@/modules/auth/components/sign-up-form';
import { validateRequest } from '@/modules/auth/services/next';

export default async function Page() {
  const session = await validateRequest();
  if (session.data) redirect('/');
  return <SignUpForm />;
}
