import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { FollowUserButton } from '@/modules/user-followings/components/follow-user-button';
import { Button } from '@/shared/components/ui/button';
import { BoltIcon } from 'lucide-react';
import Image from 'next/image';
import type { UserProfile } from '../../types/user';
import { EditUserDialogTrigger } from '../edit-user-dialog-trigger';

type ProfileHeadingProps = {
  user: UserProfile;
};

export async function ProfileHeading({ user }: ProfileHeadingProps) {
  const session = await getPageSession();

  const isCurrentUser = session?.userId === user.id;

  const createdAt = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const isAlreadyFollowing = user.followers.some(follower => follower.username === session?.user.username);

  return (
    <section className="overflow-hidden rounded-md bg-background">
      <div className="relative h-28 w-full overflow-hidden">
        <Image src={user.avatar} alt={user.username} layout="fill" objectFit="cover" className="blur-md" />

        {isCurrentUser && (
          <EditUserDialogTrigger user={user}>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <BoltIcon size={18} />
              <span className="sr-only">Editar perfil</span>
            </Button>
          </EditUserDialogTrigger>
        )}
      </div>

      <div className="z-10 flex h-[1px] items-center justify-center">
        <Image
          src={user.avatar}
          alt={user.username}
          height={80}
          width={80}
          className="absolute rounded-full border-4 border-secondary"
        />
      </div>

      <div className="flex flex-col justify-between bg-secondary p-4 text-secondary-foreground">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p className="text-sm text-secondary-foreground/75">Membro desde {createdAt}</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">{user.followers.length}</span>
            <span className="text-xs">Seguidores</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">{user.following.length}</span>
            <span className="text-xs">Seguindo</span>
          </div>

          {!isCurrentUser && <FollowUserButton userId={user.id} isAlreadyFollowing={isAlreadyFollowing} />}
        </div>
      </div>
    </section>
  );
}
