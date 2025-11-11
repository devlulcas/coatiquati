import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { files } from '@/modules/database/schema/file';
import { storage } from '@/modules/file/lib/storage';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

// Salva os metadados de uma imagem que foi salva no serviço de armazenamento
export async function updateUploadedFileHandler(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      fail('Somente usuários logados podem fazer upload de arquivos'),
      {
        status: 401,
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
  }

  const json = await request.json();

  if (!json.key) {
    return Response.json(fail('Chave de arquivo ausente'), {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const updated = await db.transaction(async (tx) => {
    const condition = and(eq(files.userId, user.id), eq(files.key, json.key));

    const file = await tx
      .select()
      .from(files)
      .where(condition)
      .then((result) => result.at(0));

    if (!file) {
      log.error('Arquivo não encontrado', json.key, user.id);
      tx.rollback();
      return fail('Arquivo não encontrado');
    }

    if (file.uploadedAt !== null) {
      log.error('Arquivo já criado', json.key, user.id);
      tx.rollback();
      return fail('Arquivo já criado');
    }

    const fileExists = await storage.headFileByKey(json.key);

    if (isFail(fileExists) || !fileExists.value) {
      const message =
        'Arquivo existe localmente, mas não esta presente no bucket';
      log.error(message);
      await tx.delete(files).where(condition);
      return fail(message);
    }

    const updated = await wrapAsyncInResult(
      tx
        .update(files)
        .set({ uploadedAt: new Date() })
        .where(condition)
        .returning()
    );

    if (isFail(updated)) {
      log.error(updated);
      tx.rollback();
      return fail('Falha ao atualizar registro do arquivo');
    }

    return updated;
  });

  if (isFail(updated)) {
    return Response.json(fail('Algo deu errado para salvar o arquivo'), {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const url = storage.getURLFromKey(json.key);

  return Response.json(ok(url));
}
