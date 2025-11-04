import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';

export function UserAvatar({
  avatar,
  username,
}: {
  avatar: string | null | undefined;
  username: string;
}) {
  return (
    <Avatar className="mx-auto">
      <AvatarImage src={avatar ?? undefined} alt={username} />
      <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
