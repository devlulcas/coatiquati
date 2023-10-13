import type { User } from '@/modules/user/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

type UserAvatarProps = {
  user: Pick<User, 'avatar' | 'username'> | null | undefined;
};

export function UserAvatar({ user }: UserAvatarProps) {
  if (!user) {
    return (
      <Avatar className="border border-foreground/25 rounded-full">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    );
  }

  const username = user.username.slice(0, 2).toUpperCase();

  return (
    <Avatar className="border border-foreground/25 rounded-full">
      <AvatarImage src={user.avatar} alt={user.username} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
}
