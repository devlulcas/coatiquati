'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import type { UpdateTopicSchema } from '../../schemas/edit-topic-schema';
import { updateTopicUseCase } from '../../use-cases/update-topic-use-case';

export async function editTopicAction(data: UpdateTopicSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar um tópico.');
  }

  await updateTopicUseCase(data, session);

  revalidatePath('/trails/' + data.trailId);
  revalidatePath('/dashboard/trails/' + data.trailId);
  revalidatePath('/profile/' + session.user.username);
}
