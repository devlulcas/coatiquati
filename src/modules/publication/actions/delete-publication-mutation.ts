'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { publicationTable } from '@/modules/database/schema/publication';
import { publicationMediaTable } from '@/modules/database/schema/publication-media';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function deletePublicationMutation(pubId: number): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
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
  const isAuthor = publication.authorId === user.id;
  const isModerator = isAdminOrAbove(user.role);

  if (!isAuthor && !isModerator) {
    return fail('Você não tem permissão para deletar esta publicação');
  }

  if (isModerator) {
    log.info('Moderador deletando publicação', { pubId, moderatorId: user.id });
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
