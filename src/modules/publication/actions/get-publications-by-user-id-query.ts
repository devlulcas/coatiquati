'use server';

import { db } from '@/modules/database/db';
import { fail, type Result, wrapAsyncInResult } from '@/shared/lib/result';
import type { Publication } from '../types/publication';

export async function getPublicationsByUserIdQuery(
  userId: string
): Promise<Result<Publication[]>> {
  const user = await db.query.user.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, userId), eq(fields.banned, false)),
  });

  if (!user) {
    return fail('Usuário não encontrado ou banido');
  }

  const pubs: Result<Publication[]> = await wrapAsyncInResult(
    db.query.publications.findMany({
      where: (fields, { eq, isNull, and }) => {
        return and(eq(fields.userId, userId), isNull(fields.deletedAt));
      },
      orderBy: (fields, { desc }) => desc(fields.createdAt),
      with: {
        medias: {
          where: (fields, { isNull }) => isNull(fields.deletedAt),
          orderBy: (fields, { asc }) => asc(fields.id),
          columns: {
            id: true,
            description: true,
            type: true,
            url: true,
          },
        },
      },
    })
  );

  return pubs;
}
