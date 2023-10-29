'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { NewImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { createNewImageContentUseCase } from '@/modules/image-content/use-cases/create-new-image-content-use-case';

export async function newImageContentAction(data: NewImageContentSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar um conteúdo.');
  }

  await createNewImageContentUseCase(data, session);
}
