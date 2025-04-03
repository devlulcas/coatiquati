import { validateRequest } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { fileTable } from '@/modules/database/schema/file';
import { storage } from '@/modules/file/lib/storage';
import { presignedURLRequestSchema } from '@/modules/file/schemas/presigned-url-request-schema';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, wrapAsyncInResult } from '@/shared/lib/result';

// Gera a URL pré assinada
export async function createPresignedURLHandler(request: Request) {
  const { data: user } = await validateRequest();

  if (!user) {
    return Response.json(fail('Somente usuários logados podem fazer upload de arquivos'), {
      status: 401,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const json = await request.json();
  const validated = presignedURLRequestSchema.safeParse(json);

  if (!validated.success) {
    const formatter = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
    const flat = validated.error.flatten();
    const errors = Object.values(flat.fieldErrors).flat();
    const message = formatter.format(errors);

    return Response.json(fail(message), {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  // Gerar URL pré assinada
  const result = await db.transaction(async tx => {
    const result = await storage.createPresignedURL(validated.data, user);

    if (isFail(result)) {
      log.error(result);
      tx.rollback();
      return fail('Falha ao criar URL pré assinada');
    }

    const inserted = await wrapAsyncInResult(
      tx.insert(fileTable).values({
        userId: user.id,
        checksum: validated.data.checksum,
        fileSize: validated.data.fileSize,
        fileType: validated.data.fileType,
        filename: validated.data.filename,
        uploadedAt: null,
        key: result.value.key,
      }),
    );

    if (isFail(inserted)) {
      log.error(inserted);
      tx.rollback();
      return fail('Algo deu errado ao salvar o registro da URL pré assinada');
    }

    return result;
  });

  if (isFail(result)) {
    log.error(result);
    return Response.json(fail('Algo deu errado ao criar url de upload'), {
      status: 500,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  return Response.json(result);
}
