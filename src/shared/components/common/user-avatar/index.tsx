import { cn } from '@/shared/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

type UserAvatarProps = {
  user: { image: string; username: string } | null;
  className?: string;
};

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) {
    return (
      <Avatar
        className={cn('rounded-full border border-foreground/25', className)}
      >
        <AvatarFallback className="rounded-none">...</AvatarFallback>
      </Avatar>
    );
  }

  const username = user.username.slice(0, 2).toUpperCase();

  return (
    <Avatar
      className={cn('rounded-full border border-foreground/25', className)}
    >
      <AvatarImage
        className="rounded-none"
        src={user.image}
        alt={user.username}
      />
      <AvatarFallback className="rounded-none">{username}</AvatarFallback>
    </Avatar>
  );
}
