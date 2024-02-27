import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import type { User } from '../../types/user';
import { EditUserDialogTrigger } from '../edit-user-dialog-trigger';
import { UserRoleBadge } from '../user-role-badge';

type ProfileHeadingProps = {
  user: User;
  isCurrentUser?: boolean;
};

export function ProfileHeading({ user, isCurrentUser }: ProfileHeadingProps) {
  const createdAt = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex gap-2">
      <Image
        className="aspect-square h-full rounded-md border object-cover"
        src={user.avatar ?? 'https://placekitten.com/100/100'}
        alt={user.username}
        width={100}
        height={100}
      />

      <div className="flex w-full flex-col gap-2 rounded-md border bg-background/50 px-5 py-5 backdrop-blur-md">
        {isCurrentUser && (
          <EditUserDialogTrigger user={user}>
            <Button variant="ghost" className="absolute right-2 top-2">
              Editar
            </Button>
          </EditUserDialogTrigger>
        )}

        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-foreground/75">Por aqui desde {createdAt}</p>
        <div className="flex items-center gap-2">
          <UserRoleBadge role={user.role} className="w-fit text-sm font-bold" />
          <span>{user.emailVerified ? 'Verificado' : 'Não verificado'}</span>
        </div>
      </div>
    </div>
  );
}
