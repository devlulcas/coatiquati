'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { revalidatePath } from 'next/cache';
import type { NewTrailSchema } from '../../schemas/new-trail-schema';
import { createNewTrailUseCase } from '../../use-cases/create-new-trail-use-case';

export async function newTrailAction(data: NewTrailSchema) {
  const session = await getPageSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  if (session.user.role !== roles.ADMIN && session.user.role !== roles.HIGH_PRIVILEGE_ADMIN) {
    throw new Error('Você precisa ser um administrador para criar uma nova trilha.');
  }

  await createNewTrailUseCase({
    trail: data,
    authorId: session.user.id,
  });

  revalidatePath('/trails');
  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
