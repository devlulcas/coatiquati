'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { NewVideoContentSchema } from '@/modules/video-content/schemas/new-video-content-schema';
import { createNewVideoContentUseCase } from '@/modules/video-content/use-cases/create-new-video-content-use-case';

export async function newVideoContentAction(data: NewVideoContentSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar um conteúdo.');
  }

  await createNewVideoContentUseCase(data, session);
}
