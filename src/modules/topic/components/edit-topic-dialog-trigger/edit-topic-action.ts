'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { UpdateTopicSchema } from '../../schemas/edit-topic-schema';
import { updateTopicUseCase } from '../../use-cases/update-topic-use-case';

export async function editTopicAction(data: UpdateTopicSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar um tópico.');
  }

  if (session.user.role !== roles.ADMIN) {
    throw new Error('Você precisa ser um administrador para editar um tópico.');
  }

  await updateTopicUseCase({
    topic: data.topic,
    topicId: data.topicId,
  });

  revalidatePath('/trails/' + data.topic.trailId);
  revalidatePath('/dashboard/trails/' + data.topic.trailId);
  revalidatePath('/profile/' + session.user.username);
}
