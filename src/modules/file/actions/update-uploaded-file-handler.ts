import { validateRequest } from '@/modules/auth/services/lucia';
import { db } from '@/modules/database/db';
import { fileTable } from '@/modules/database/schema/file';
import { storage } from '@/modules/file/lib/storage';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

// Salva os metadados de uma imagem que foi salva no serviço de armazenamento
export async function updateUploadedFileHandler(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(JSON.stringify(fail('Somente usuários logados podem fazer upload de arquivos')), {
      status: 401,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const json = await request.json();

  if (!json.key) {
    return new Response(JSON.stringify(fail('Chave de arquivo ausente')), {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const updated = await db.transaction(async tx => {
    const condition = and(eq(fileTable.userId, user.id), eq(fileTable.key, json.key));

    const file = await tx.select().from(fileTable).where(condition).get();

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
      const message = 'Arquivo existe localmente, mas não esta presente no bucket';
      log.error(message);
      await tx.delete(fileTable).where(condition);
      return fail(message);
    }

    const updated = await wrapAsyncInResult(
      tx.update(fileTable).set({ uploadedAt: new Date() }).where(condition).returning(),
    );

    if (isFail(updated)) {
      log.error(updated);
      tx.rollback();
      return fail('Falha ao atualizar registro do arquivo');
    }

    return updated;
  });

  if (isFail(updated)) {
    return new Response(JSON.stringify(fail('Algo deu errado para salvar o arquivo')), {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  const url = storage.getURLFromKey(json.key);

  return Response.json(JSON.stringify(ok(url)));
}
