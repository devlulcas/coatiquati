import Image from 'next/image';
import type { User } from '../../types/user';
import { UserRoleBadge } from '../user-role-badge';

type ProfileHeadingProps = {
  user: User;
};

export function ProfileHeading({ user }: ProfileHeadingProps) {
  const createdAt = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex gap-2">
      <Image
        className="rounded-md object-cover aspect-square h-full border"
        src={user.avatar ?? 'https://placekitten.com/100/100'}
        alt={user.username}
        width={100}
        height={100}
      />

      <div className="px-5 py-5 bg-background/50 backdrop-blur-md border rounded-md flex flex-col gap-2 w-full">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-foreground/75">Por aqui desde {createdAt}</p>
        <div className="flex gap-2 items-center">
          <UserRoleBadge role={user.role} className="w-fit font-bold text-sm" />
          <span>{user.emailVerified ? 'Verificado' : 'Não verificado'}</span>
        </div>
      </div>
    </div>
  );
}
