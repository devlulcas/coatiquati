'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { trailWithIdSchema, type TrailWithIdSchema } from '../schemas/trail-with-id-schema';

export async function toggleTrailStatusMutation(params: TrailWithIdSchema): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Usuário não autenticado.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Somente administradores podem editar trilhas.');
  }

  const validatedParams = trailWithIdSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para editar trilha.');
  }

  const trailRepository = new TrailRepository();

  const trailResult = await wrapAsyncInResult(trailRepository.getTrailById(validatedParams.data.id));

  if (trailResult.type === 'fail') {
    return fail('Trilha não encontrada.');
  }

  const trail = trailResult.value;

  if (trail.status === 'PUBLISHED') {
    trailRepository.omitTrail(validatedParams.data.id);
    revalidateTrails({ username: session.user.username, trailId: trail.id });
    return ok('Trilha omitida com sucesso.');
  }

  if (trail.status === 'DRAFT') {
    trailRepository.enableTrail(validatedParams.data.id);
    revalidateTrails({ username: session.user.username, trailId: trail.id });
    return ok('Trilha publicada com sucesso.');
  }

  return fail('Status de trilha inválido.');
}
