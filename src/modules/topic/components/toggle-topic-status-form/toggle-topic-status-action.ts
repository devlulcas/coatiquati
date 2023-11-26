'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import { type TopicWithIdSchema } from '../../schemas/topic-with-id-schema';
import { ToggleTopicStatusUseCase } from '../../use-cases/toggle-topic-status-use-case';

export async function toggleTopicStatusAction(data: TopicWithIdSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para alterar o estado de um tópico.');
  }

  const toggleTopicStatusUseCase = new ToggleTopicStatusUseCase();
  await toggleTopicStatusUseCase.execute(data, session);

  revalidatePath('/trails/*');
  revalidatePath('/dashboard/trails/*');
}
