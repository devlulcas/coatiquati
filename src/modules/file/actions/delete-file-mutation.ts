import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { fileTable } from '@/modules/database/schema/file';
import { storage } from '@/modules/file/lib/storage';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function deleteFileMutation(key: string) {
  const { user } = await validateRequest();

  if (!user) {
    return fail('Somente usuários logados podem fazer manipular arquivos');
  }

  const isAdmin = isAdminOrAbove(user.role);
  log.info(`Admin ${user.id} tentou deletar arquivo ${key}`);

  const deleted = await db.transaction(async tx => {
    const condition = isAdmin ? eq(fileTable.key, key) : and(eq(fileTable.userId, user.id), eq(fileTable.key, key));

    const file = await tx.select().from(fileTable).where(condition).get();

    if (!file) {
      log.error('Arquivo não encontrado', key, user.id);
      tx.rollback();
      return fail('Arquivo não encontrado');
    }

    if (file.deletedAt !== null) {
      log.error('Arquivo já deletado', key, user.id);
      tx.rollback();
      return fail('Arquivo já deletado');
    }

    const fileExists = await storage.headFileByKey(key);

    if (isFail(fileExists) || !fileExists.value) {
      const message = 'Arquivo existe localmente, mas não esta presente no bucket';
      log.error(message);
      await tx.delete(fileTable).where(condition);
      return fail(message);
    }

    const updated = await wrapAsyncInResult(
      tx.update(fileTable).set({ deletedAt: new Date() }).where(condition).returning(),
    );

    if (isFail(updated)) {
      log.error(updated);
      tx.rollback();
      return fail('Falha ao atualizar registro do arquivo');
    }

    return updated;
  });

  return deleted;
}
