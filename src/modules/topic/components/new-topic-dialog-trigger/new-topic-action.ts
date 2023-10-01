'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { revalidatePath } from 'next/cache';
import type { NewTopicSchema } from '../../schemas/new-topic-schema';
import { createNewTopicUseCase } from '../../use-cases/create-new-topic-use-case';

export async function newTopicAction(data: NewTopicSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar uma nova trilha.');
  }

  if (!isAdminOrAbove(session.user.role)) {
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
