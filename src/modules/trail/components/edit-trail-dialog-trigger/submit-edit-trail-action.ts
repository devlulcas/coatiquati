'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { revalidatePath } from 'next/cache';
import type { UpdateTrailSchema } from '../../schemas/edit-trail-schema';
import { updateTrailUseCase } from '../../use-cases/update-trail-use-case';

export async function submitEditTrail(data: UpdateTrailSchema) {
  const session = await getPageSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar uma trilha.');
  }

  if (session.user.role !== roles.ADMIN) {
    throw new Error(
      'Você precisa ser um administrador para editar uma trilha.'
    );
  }

  await updateTrailUseCase({
    trail: data.trail,
    trailId: data.trailId,
  });

  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
