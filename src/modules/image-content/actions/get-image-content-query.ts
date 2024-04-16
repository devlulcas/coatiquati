'use server';

import type { ContentImageSelect } from '@/modules/database/schema/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';

export async function getImageContentQuery(baseContentId: number): Promise<Result<ContentImageSelect>> {
  const imageContentRepository = new ImageContentRepository();

  try {
    const content = await imageContentRepository.getByContentId(baseContentId);
    return ok(content);
  } catch (error) {
    log.error('Falha ao buscar conteúdo de imagem.', String(error));
    return fail('Falha ao buscar conteúdo de imagem.');
  }
}
