import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { User } from '../../types/user';

type UserAvatarProps = Pick<User, 'avatar' | 'username'>;

export function UserAvatar({ avatar, username }: UserAvatarProps) {
  return (
    <Avatar className="mx-auto">
      <AvatarImage src={avatar ?? ''} alt={username} />
      <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
