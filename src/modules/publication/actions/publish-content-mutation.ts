'use server';

import { db } from '@/modules/database/db';
import { publicationMediaTable, publicationTable } from '@/modules/database/schema/publication';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { desc, eq } from 'drizzle-orm';
import { createPublicationSchema, type CreatePublicationSchema } from '../schemas/create-publication';

export async function publishContentMutation(params: CreatePublicationSchema): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (session === null) {
    return fail('Somente um usuário autenticado pode fazer publicações!');
  }

  if (session.user.isBanned) {
    return fail('Usuários banidos não podem fazer publicações!');
  }

  const validatedParams = createPublicationSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail(validatedParams.error.errors[0].message);
  }

  // Tentativa de evitar spam de publicações
  const lastPublication = await db
    .select({ at: publicationTable.updatedAt })
    .from(publicationTable)
    .where(eq(publicationTable.authorId, session.userId))
    .orderBy(desc(publicationTable.id))
    .get();

  const SIXTY_SECONDS = 60000;

  const timeSinceLastPublication = lastPublication ? Date.now() - lastPublication.at.getTime() : SIXTY_SECONDS;

  if (timeSinceLastPublication < SIXTY_SECONDS) {
    return fail('Aguarde um minuto antes de fazer outra publicação');
  }

  // Salva a publicação e suas mídias
  try {
    const pubId = await db.transaction(async tx => {
      try {
        const pub = await tx
          .insert(publicationTable)
          .values({ authorId: session.userId, content: validatedParams.data.content })
          .returning({ id: publicationTable.id })
          .get();

        validatedParams.data.medias.forEach(async media => {
          await tx.insert(publicationMediaTable).values({
            publicationId: pub.id,
            description: media.description,
            url: media.url,
            type: media.type,
          });
        });

        return pub.id;
      } catch (error) {
        tx.rollback();
        log.error('Erro ao publicar conteúdo', String(error));
        throw new Error('Erro ao publicar conteúdo');
      }
    });

    return ok(pubId);
  } catch (error) {
    log.error('Erro ao publicar conteúdo', String(error));
    return fail('Erro ao publicar conteúdo');
  }
}
