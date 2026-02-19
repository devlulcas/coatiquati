'use server';

import { auth } from '@/modules/auth/lib/auth';
import { assertAuthenticated, getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { trails } from '@/modules/database/schema/trail';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { revalidateTrails } from '../lib/revalidate-trail';
import { type TrailWithIdSchema, trailWithIdSchema } from '../schemas/trail-with-id-schema';

export async function changeTrailContentStatusMutation(params: TrailWithIdSchema): Promise<Result<string>> {
  const currentUser = await getCurrentUser();
  assertAuthenticated(currentUser);

  const can = await auth.api.userHasPermission({
    body: {
      userId: currentUser.id,
      permission: { trail: ['change_publication_status'] },
    },
  });

  if (!can.success) {
    return fail('Você não tem permissão para manipular uma trilha.');
  }

  const parsed = trailWithIdSchema.safeParse(params);

  if (!parsed.success) {
    return fail('Parâmetros inválidos para editar trilha.');
  }

  const trail = await db.query.trails.findFirst({
    columns: { id: true, status: true },
    where: (fields, { eq }) => eq(fields.id, parsed.data.id),
  });

  if (!trail) {
    return fail('Trilha não encontrada.');
  }

  if (trail.status === parsed.data.status) {
    return fail('Trilha já está no status desejado.');
  }

  const updatedTrail = await db
    .update(trails)
    .set({ status: parsed.data.status })
    .where(eq(trails.id, parsed.data.id))
    .returning({ id: trails.id })
    .then(result => result.at(0));

  if (!updatedTrail) {
    return fail('Erro ao atualizar status da trilha.');
  }

  revalidateTrails({
    username: currentUser.username,
    trailId: updatedTrail.id,
  });

  return ok('Status da trilha atualizado com sucesso.');
}
