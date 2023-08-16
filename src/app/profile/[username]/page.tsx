import { getUserProfileUseCase } from '@/modules/user/use-cases/get-user-profile-use-case';

type PageProps = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: PageProps) {
  const profile = await getUserProfileUseCase({
    username: params.username,
  });

  return (
    <>
      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </>
  );
}
