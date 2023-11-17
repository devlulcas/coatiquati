'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { TrailWithIdSchema } from '../../schemas/trail-with-id-schema';
import { ToggleTrailStatusUseCase } from '../../use-cases/toggle-trail-status-use-case';

export async function toggleTrailStatusAction(data: TrailWithIdSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  const toggleTrailStatusUseCase = new ToggleTrailStatusUseCase();
  await toggleTrailStatusUseCase.execute(data, session);

  revalidatePath('/trails/*');
  revalidatePath('/dashboard');
}
