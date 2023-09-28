'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { revalidatePath } from 'next/cache';
import type { NewTopicSchema } from '../../schemas/new-topic-schema';
import { createNewTopicUseCase } from '../../use-cases/create-new-topic-use-case';

export async function newTopicAction(data: NewTopicSchema) {
  const session = await getPageSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  if (session.user.role !== roles.ADMIN) {
    throw new Error('Você precisa ser um administrador para criar uma nova trilha.');
  }

  createNewTopicUseCase({
    topic: data,
    authorId: session.user.id,
  });

  revalidatePath('/trails/' + data.trailId);
  revalidatePath('/dashboard/trails/' + data.trailId);
  revalidatePath('/profile/' + session.user.username);
}
