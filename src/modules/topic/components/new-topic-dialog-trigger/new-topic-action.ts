'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { NewTopicSchema } from '../../schemas/new-topic-schema';
import { CreateNewTopicUseCase } from '../../use-cases/create-new-topic-use-case';

export async function newTopicAction(data: NewTopicSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado como administrador para criar um novo tópico.');
  }

  const createNewTopicUseCase = new CreateNewTopicUseCase();
  createNewTopicUseCase.execute(data, session);

  revalidatePath('/trails/' + data.trailId);
  revalidatePath('/dashboard/trails/' + data.trailId);
  revalidatePath('/profile/' + session.user.username);
}
