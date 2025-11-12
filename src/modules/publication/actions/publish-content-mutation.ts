'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { publications } from '@/modules/database/schema/publication';
import { publicationMedias } from '@/modules/database/schema/publication-media';
import { fail, ok, type Result } from '@/shared/lib/result';
import {
  type CreatePublicationSchema,
  createPublicationSchema,
} from '../schemas/create-publication';

export async function publishContentMutation(
  params: CreatePublicationSchema
): Promise<Result<number>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  if (user.banned) {
    return fail('Você está banido e não pode fazer publicações!');
  }

  const validatedParams = createPublicationSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail(validatedParams.error.message);
  }

  try {
    const pubId = await db.transaction(async (tx) => {
      const pub = await tx
        .insert(publications)
        .values({ userId: user.id, content: validatedParams.data.content })
        .returning({ id: publications.id })
        .then((result) => result.at(0));

      if (!pub) {
        throw new Error('Erro ao publicar conteúdo');
      }

      validatedParams.data.medias.forEach(async (media) => {
        await tx.insert(publicationMedias).values({
          publicationId: pub.id,
          description: media.description,
          url: media.url,
          type: media.type,
        });
      });

      return pub.id;
    });

    return ok(pubId);
  } catch (error) {
    console.error(error);
    return fail('Erro ao publicar conteúdo. Tente novamente mais tarde.');
  }
}
