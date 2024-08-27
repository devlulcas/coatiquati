'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { trailWithIdSchema, type TrailWithIdSchema } from '../schemas/trail-with-id-schema';

export async function toggleTrailStatusMutation(params: TrailWithIdSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Usuário não autenticado.');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Somente administradores podem editar trilhas.');
  }

  const validatedParams = trailWithIdSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para editar trilha.');
  }

  const trailRepository = new TrailRepository();

  const trailResult = await wrapAsyncInResult(trailRepository.getTrailById(validatedParams.data.id));

  if (isFail(trailResult)) {
    return fail('Trilha não encontrada.');
  }

  const trail = trailResult.value;

  if (trail.status === 'PUBLISHED') {
    trailRepository.omitTrail(validatedParams.data.id);
    revalidateTrails({ username: user.username, trailId: trail.id });
    return ok('Trilha omitida com sucesso.');
  }

  if (trail.status === 'DRAFT') {
    trailRepository.enableTrail(validatedParams.data.id);
    revalidateTrails({ username: user.username, trailId: trail.id });
    return ok('Trilha publicada com sucesso.');
  }

  return fail('Status de trilha inválido.');
}
