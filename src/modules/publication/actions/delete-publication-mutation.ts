'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { publicationMediaTable, publicationTable } from '@/modules/database/schema/publication';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';

export async function deletePublicationMutation(pubId: number): Promise<void> {
  const session = await getActionSession();

  if (session === null) {
    throw new Error('Somente um usuário autenticado pode deletar publicações!');
  }

  const publication = await db.query.publicationTable.findFirst({
    columns: { authorId: true },
    where: (fields, op) => op.and(op.eq(fields.id, pubId), op.isNull(fields.deletedAt)),
    with: {
      medias: {
        columns: { id: true },
        where: (fields, op) => op.isNull(fields.deletedAt),
      },
    },
  });

  if (!publication) {
    throw new Error('Publicação não encontrada');
  }

  const isAuthor = publication.authorId === session.userId;
  const isModerator = isAdminOrAbove(session.user.role);

  if (!isAuthor && !isModerator) {
    throw new Error('Você não tem permissão para deletar esta publicação');
  }

  if (isModerator) {
    log.info('Moderador deletando publicação', { pubId, moderatorId: session.userId });
  }

  await db.transaction(async tx => {
    await tx.update(publicationTable).set({ deletedAt: new Date() }).where(eq(publicationTable.id, pubId)).execute();

    publication.medias.forEach(async media => {
      await tx
        .update(publicationMediaTable)
        .set({ deletedAt: new Date() })
        .where(eq(publicationMediaTable.id, media.id))
        .execute();
    });
  });
}
