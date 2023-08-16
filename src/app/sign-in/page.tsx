import { SignInForm } from '@/modules/auth/components/sign-in-form';
import { getPageSession } from '@/modules/auth/helpers/get-page-session';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getPageSession();

  if (session) redirect('/');

  return <SignInForm />;
}
