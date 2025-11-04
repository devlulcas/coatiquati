import { getCurrentUser } from '@/modules/auth/services/next';
import { currentUserIsFollowingQuery } from '@/modules/user-followings/actions/current-user-is-following-query';
import { getFollowers } from '@/modules/user-followings/actions/get-followers';
import { getFollowings } from '@/modules/user-followings/actions/get-followings';
import { FollowUserButton } from '@/modules/user-followings/components/follow-user-button';
import { Button } from '@/shared/components/ui/button';
import { unwrapOr } from '@/shared/lib/result';
import { BoltIcon } from 'lucide-react';
import Image from 'next/image';
import type { PublicUser } from '../../types/user';
import { EditUserDialogTrigger } from '../edit-user-dialog-trigger';

type ProfileHeadingProps = {
  user: PublicUser;
};

export async function ProfileHeading({ user }: ProfileHeadingProps) {
  const currentUser = await getCurrentUser();

  const isCurrentUser = currentUser?.id === user.id;

  const createdAt = user.createdAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const isAlreadyFollowing = await (() => {
    if (!currentUser) return false;
    return currentUserIsFollowingQuery(currentUser.id, user.id).then(
      (result) => result.value
    );
  })();

  const followers = unwrapOr(await getFollowers(user.id), []);
  const following = unwrapOr(await getFollowings(user.id), []);

  return (
    <section className="overflow-hidden rounded-md bg-secondary/75">
      <div className="relative h-28 w-full overflow-hidden">
        <Image
          src={user.image}
          alt={user.username}
          layout="fill"
          objectFit="cover"
          className="blur-md"
        />

        {isCurrentUser && (
          <EditUserDialogTrigger user={user}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <BoltIcon size={18} />
              <span className="sr-only">Editar perfil</span>
            </Button>
          </EditUserDialogTrigger>
        )}
      </div>

      <div className="z-10 flex h-[1px] items-center justify-center">
        <Image
          src={user.image}
          alt={user.username}
          height={80}
          width={80}
          className="absolute rounded-full border-4 border-secondary"
        />
      </div>

      <div className="flex flex-col justify-between p-4 text-secondary-foreground">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p className="text-sm text-secondary-foreground/75">
          Membro desde {createdAt}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">{followers.length}</span>
            <span className="text-xs">Seguidores</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">{following.length}</span>
            <span className="text-xs">Seguindo</span>
          </div>

          {!isCurrentUser && (
            <FollowUserButton
              userId={user.id}
              isAlreadyFollowing={isAlreadyFollowing}
            />
          )}
        </div>
      </div>
    </section>
  );
}
