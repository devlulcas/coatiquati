'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { ContentType } from '@/modules/content/types/content-json-field';
import { log } from '@/modules/logging/lib/pino';
import {
  newVideoContentSchema,
  type NewVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';
import { fail, isOk, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertVideoContentMutation(params: NewVideoContentSchema): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (!user) {
    return fail('Você precisa estar logado para criar um conteúdo de vídeo.');
  }

  const validated = newVideoContentSchema.safeParse(params);

  if (!validated.success) {
    return fail('Parâmetros inválidos para cadastro de conteúdo de vídeo.');
  }

  const repo = new BaseContentRepository();

  const author = validated.data.id ? await repo.getAuthorId(validated.data.id) : null

  const newAuthorId = author && isOk(author) ? author.value : user.id

  const newContentId = await wrapAsyncInResult(
    repo.upsertBaseContent({
      contentType: ContentType.Video,
      id: validated.data.id,
      title: params.title,
      topicId: params.topicId,
      authorId: newAuthorId,
      content: { description: params.description, src: params.src },
    }),
  );

  log.info('Conteúdo de vídeo criado com sucesso', { newContentId, userId: user.id });

  return newContentId;
}
