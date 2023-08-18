import { SignUpForm } from '@/modules/auth/components/sign-up-form';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getPageSession();

  if (session) redirect('/');

  return <SignUpForm />;
}
