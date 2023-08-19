import Image from 'next/image';
import type { User } from '../../types/user';
import { UserRoleBadge } from '../user-role-badge';

type ProfileHeadingProps = {
  user: User;
};

export function ProfileHeading({ user }: ProfileHeadingProps) {
  return (
    <div className="flex gap-2 bg-background/50 backdrop-blur-md border rounded-md overflow-clip">
      <Image
        src={user.avatar ?? 'https://placekitten.com/100/100'}
        alt={user.username}
        width={100}
        height={100}
        style={{ clipPath: 'polygon(0 0, 100% 0%, 75% 100%, 0% 100%)' }}
      />

      <div className="px-5 py-5">
        <h1 className="text-3xl font-bold mb-3">{user.username}</h1>
        <UserRoleBadge
          role={user.role}
          className={(isAdmin) => [
            'px-2 py-1 rounded-md text-white font-bold text-sm',
            isAdmin ? 'bg-purple-500' : 'bg-pink-500',
          ]}
        />
      </div>
    </div>
  );
}