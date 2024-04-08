'use server';

import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import type { Publication } from '../types/publication';

export async function getPublicationsByUserIdQuery(userId: string): Promise<Publication[]> {
  const user = await db.query.userTable.findFirst({
    where: (fields, op) => op.eq(fields.id, userId),
  });

  if (!user || user.isBanned) {
    log.warn('Usuário não encontrado ou banido', { userId });
    return [];
  }

  const pubs: Publication[] = await db.query.publicationTable.findMany({
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
  });

  if (!pubs) {
    return [];
  }

  return pubs;
}
