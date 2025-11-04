'use server';

import { db } from '@/modules/database/db';
import { fail, ok, type Result } from '@/shared/lib/result';
import {
  mapToPublicUser,
  PUBLIC_USER_COLUMNS,
  type PublicUser,
} from '../types/user';

export async function getUserProfileQuery(
  username: string
): Promise<Result<PublicUser>> {
  const user = await db.query.user.findFirst({
    where: (fields, operators) => operators.eq(fields.username, username),
    columns: PUBLIC_USER_COLUMNS,
  });

  if (!user) {
    return fail('Usuário não encontrado');
  }

  return ok(mapToPublicUser(user));
}
