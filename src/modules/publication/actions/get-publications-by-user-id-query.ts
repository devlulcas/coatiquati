'use server';

import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, ok, type Result } from '@/shared/lib/result';
import type { Publication } from '../types/publication';

export async function getPublicationsByUserIdQuery(userId: string): Promise<Result<Publication[]>> {
  const user = await db.query.userTable.findFirst({
    where: (fields, op) => op.eq(fields.id, userId),
  });

  if (!user || user.isBanned) {
    log.warn('Usuário não encontrado ou banido', { userId });
    return ok([]);
  }

  const pubs: Result<Publication[]> = await asyncResult(
    db.query.publicationTable.findMany({
      where: (fields, op) => op.and(op.eq(fields.authorId, userId), op.isNull(fields.deletedAt)),
      with: {
        medias: {
          where: (fields, op) => op.isNull(fields.deletedAt),
          orderBy: (fields, op) => op.asc(fields.id),
          columns: {
            id: true,
            description: true,
            type: true,
            url: true,
          },
        },
      },
    }),
  );

  if (pubs.type === 'fail') {
    log.error('Falha ao buscar publicações', { userId });
    return pubs;
  }

  return pubs;
}
