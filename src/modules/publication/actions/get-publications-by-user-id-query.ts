'use server';

import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import { isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import type { Publication } from '../types/publication';

export async function getPublicationsByUserIdQuery(userId: string): Promise<Result<Publication[]>> {
  const user = await db.query.userTable.findFirst({
    where: (fields, op) => op.eq(fields.id, userId),
  });

  if (!user || user.bannedAt) {
    log.warn('Usuário não encontrado ou banido', { userId });
    return ok([]);
  }

  const pubs: Result<Publication[]> = await wrapAsyncInResult(
    db.query.publicationTable.findMany({
      where: (fields, op) => op.and(op.eq(fields.authorId, userId), op.isNull(fields.deletedAt)),
      orderBy: (fields, op) => op.desc(fields.createdAt),
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

  if (isFail(pubs)) {
    log.error('Falha ao buscar publicações', { userId });
    return pubs;
  }

  return pubs;
}
