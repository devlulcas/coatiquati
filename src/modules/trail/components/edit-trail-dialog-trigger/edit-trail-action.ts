'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { UpdateTrailSchema } from '../../schemas/edit-trail-schema';
import { UpdateTrailUseCase } from '../../use-cases/update-trail-use-case';

export async function editTrailAction(data: UpdateTrailSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar uma trilha.');
  }

  const updateTrailUseCase = new UpdateTrailUseCase();
  await updateTrailUseCase.execute(data, session);

  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
