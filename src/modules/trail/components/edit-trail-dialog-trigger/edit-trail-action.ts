'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { revalidatePath } from 'next/cache';
import type { UpdateTrailSchema } from '../../schemas/edit-trail-schema';
import { updateTrailUseCase } from '../../use-cases/update-trail-use-case';

export async function editTrailAction(data: UpdateTrailSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar uma trilha.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você precisa ser um administrador para editar uma trilha.');
  }

  await updateTrailUseCase({
    trail: data.trail,
    trailId: data.trailId,
  });

  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
