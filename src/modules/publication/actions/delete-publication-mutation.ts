'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { publications } from '@/modules/database/schema/publication';
import { publicationMedias } from '@/modules/database/schema/publication-media';
import {
  fail,
  ok,
  type Result,
  unwrapOr,
  wrapAsyncInResult,
} from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function deletePublicationMutation(
  pubId: number
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const publicationResult = await wrapAsyncInResult(
    db.query.publications.findFirst({
      columns: { userId: true },
      where: (fields, op) =>
        op.and(op.eq(fields.id, pubId), op.isNull(fields.deletedAt)),
      with: {
        medias: {
          columns: { id: true },
          where: (fields, op) => op.isNull(fields.deletedAt),
        },
      },
    })
  );

  const publication = unwrapOr(publicationResult, undefined);

  if (!publication) {
    return fail('Publicação não encontrada');
  }

  const result = await db.transaction(async (tx) => {
    try {
      await tx
        .update(publications)
        .set({ deletedAt: new Date() })
        .where(eq(publications.id, pubId))
        .execute();

      await Promise.all(
        publication.medias.map(async (media) =>
          tx
            .update(publicationMedias)
            .set({ deletedAt: new Date() })
            .where(eq(publicationMedias.id, media.id))
            .execute()
        )
      );

      return ok('Publicação deletada com sucesso');
    } catch (error) {
      console.error(error);
      tx.rollback();
      return fail('Erro ao deletar publicação. Tente novamente mais tarde.');
    }
  });

  return result;
}
