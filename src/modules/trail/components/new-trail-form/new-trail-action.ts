'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { NewTrailSchema } from '../../schemas/new-trail-schema';
import { createNewTrailUseCase } from '../../use-cases/create-new-trail-use-case';

export async function newTrailAction(data: NewTrailSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  await createNewTrailUseCase(data, session);

  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
