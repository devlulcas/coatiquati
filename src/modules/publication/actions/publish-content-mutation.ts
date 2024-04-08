'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { db } from '@/modules/database/db';
import { publicationMediaTable, publicationTable } from '@/modules/database/schema/publication';
import { log } from '@/modules/logging/lib/pino';
import { desc, eq } from 'drizzle-orm';
import { createPublicationSchema, type CreatePublicationSchema } from '../schemas/create-publication';

export async function publishContentMutation(params: CreatePublicationSchema): Promise<number> {
  const session = await getActionSession();

  if (session === null) {
    throw new Error('Somente um usuário autenticado pode fazer publicações!');
  }

  if (session.user.isBanned) {
    throw new Error('Usuários banidos não podem fazer publicações!');
  }

  const validatedParams = createPublicationSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error(validatedParams.error.errors[0].message);
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
    throw new Error('Aguarde um minuto antes de fazer outra publicação');
  }

  // Salva a publicação e suas mídias
  try {
    const pubId = db.transaction(async tx => {
      try {
        const pub = await tx
          .insert(publicationTable)
          .values({ authorId: session.userId, content: validatedParams.data.content })
          .returning({ id: publicationTable.id })
          .get();

        validatedParams.data.medias.forEach(async media => {
          tx.insert(publicationMediaTable).values({
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

    return pubId;
  } catch (error) {
    log.error('Erro ao publicar conteúdo', String(error));
    throw new Error('Erro ao publicar conteúdo');
  }
}