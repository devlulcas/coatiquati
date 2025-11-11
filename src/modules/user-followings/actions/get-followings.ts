import { getRole } from '@/modules/auth/lib/auth-client';
import { db } from '@/modules/database/db';
import type { PublicUser } from '@/modules/user/types/user';
import { ok, type Result } from '@/shared/lib/result';

export async function getFollowings(
  userId: string
): Promise<Result<PublicUser[]>> {
  const followings = await db.query.userFollowers.findMany({
    where: (fields, operators) => operators.eq(fields.followerId, userId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
          banned: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  return ok(
    followings.map(({ user }) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      createdAt: user.createdAt,
      banned: Boolean(user.banned),
      role: getRole(user.role),
    }))
  );
}
