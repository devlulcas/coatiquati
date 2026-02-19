'use server';

import { auth } from '@/modules/auth/lib/auth';
import { assertAuthenticated, getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/lib/content-enum';
import { contributions } from '@/modules/database/schema/contribution';
import { trails } from '@/modules/database/schema/trail';
import { fail, ok } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { upsertTrailSchema, type UpsertTrailSchema } from '../schemas/new-trail-schema';

export async function upsertTrailMutation(params: UpsertTrailSchema) {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const can = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permission: { trail: ['create', 'edit'] },
    },
  });

  if (can.error || !can.success) {
    return fail('Você não tem permissão para manipular uma trilha.');
  }

  const parsed = upsertTrailSchema.safeParse(params);

  if (!parsed.success) {
    return fail('Parâmetros inválidos para manipular uma trilha.');
  }

  const getExistingTrail = () => {
    if (typeof parsed.data.id !== 'number') {
      return undefined;
    }

    return db
      .select({
        id: trails.id,
        authorId: trails.authorId,
        status: trails.status,
      })
      .from(trails)
      .where(eq(trails.id, parsed.data.id))
      .then(result => result.at(0));
  };

  try {
    const result = await db.transaction(async tx => {
      const existingTrail = await getExistingTrail();

      const savedTrail = await tx
        .insert(trails)
        .values({
          id: parsed.data.id,
          authorId: existingTrail ? existingTrail.authorId : user.id,
          status: existingTrail ? existingTrail.status : ContentStatus.DRAFT,
          categoryId: parsed.data.categoryId,
          title: parsed.data.title,
          description: parsed.data.description,
          thumbnail: parsed.data.thumbnail,
        })
        .onConflictDoUpdate({ target: [trails.id], set: parsed.data })
        .returning({ id: trails.id })
        .then(result => result.at(0));

      if (!savedTrail) {
        throw new Error('Erro ao manipular trilha');
      }

      const savedContribution = await tx
        .insert(contributions)
        .values({
          userId: user.id,
          trailId: savedTrail.id,
          topicId: null,
          contentId: null,
        })
        .returning({ id: contributions.id })
        .then(result => result.at(0));

      if (!savedContribution) {
        throw new Error('Erro ao manipular contribuição');
      }

      return { trailId: savedTrail.id, contributionId: savedContribution.id };
    });

    return ok(result);
  } catch (error) {
    console.error(error);
    return fail('Falha ao manipular trilha');
  }
}
