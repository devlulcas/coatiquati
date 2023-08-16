import { getPageSession } from '@/modules/auth/helpers/get-page-session';

export default async function Page() {
  const session = await getPageSession();

  return (
    <>
      <h1>{session?.user.username}</h1>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </>
  );
}
