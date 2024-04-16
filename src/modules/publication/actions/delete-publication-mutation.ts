'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { publicationMediaTable, publicationTable } from '@/modules/database/schema/publication';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function deletePublicationMutation(pubId: number): Promise<Result<string>> {
  const session = await getActionSession();

  if (session === null) {
    return fail('Somente um usuário autenticado pode deletar publicações!');
  }

  const publicationResult = await wrapAsyncInResult(
    db.query.publicationTable.findFirst({
      columns: { authorId: true },
      where: (fields, op) => op.and(op.eq(fields.id, pubId), op.isNull(fields.deletedAt)),
      with: {
        medias: {
          columns: { id: true },
          where: (fields, op) => op.isNull(fields.deletedAt),
        },
      },
    }),
  );

  if (publicationResult.type === 'fail' || typeof publicationResult.value === 'undefined') {
    return fail('Publicação não encontrada');
  }

  const publication = publicationResult.value;
  const isAuthor = publication.authorId === session.userId;
  const isModerator = isAdminOrAbove(session.user.role);

  if (!isAuthor && !isModerator) {
    return fail('Você não tem permissão para deletar esta publicação');
  }

  if (isModerator) {
    log.info('Moderador deletando publicação', { pubId, moderatorId: session.userId });
  }

  const result = await db.transaction(async tx => {
    try {
      await tx.update(publicationTable).set({ deletedAt: new Date() }).where(eq(publicationTable.id, pubId)).execute();

      await Promise.all(
        publication.medias.map(async media =>
          tx
            .update(publicationMediaTable)
            .set({ deletedAt: new Date() })
            .where(eq(publicationMediaTable.id, media.id))
            .execute(),
        ),
      );

      return ok('Publicação deletada com sucesso');
    } catch (error) {
      tx.rollback();
      log.error('Erro ao deletar publicação', String(error));
      return fail('Erro ao deletar publicação. Tente novamente mais tarde.');
    }
  });

  return result;
}
