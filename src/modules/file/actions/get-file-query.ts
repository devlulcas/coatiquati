'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import type { PaginationSchema } from '@/modules/database/types/pagination';
import { fail, isOk, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { fileType } from '../lib/file-type';

export async function getFilesQuery(pagination: PaginationSchema = { skip: 0, take: 100 }) {
  const { data: user } = await validateRequest();

  if (!user || !isAdminOrAbove(user.role)) {
    return fail('Usuário sem permissão para a ação!');
  }

  const results = await wrapAsyncInResult(
    db.query.fileTable.findMany({
      offset: pagination.skip,
      limit: pagination.take,
      with: {
        user: {
          columns: {
            avatar: true,
            bannedAt: true,
            createdAt: true,
            deletedAt: true,
            email: true,
            id: true,
            role: true,
            updatedAt: true,
            username: true,
            verifiedAt: true,
          },
        },
      },
    }),
  );

  if (isOk(results)) {
    return ok(results.value.map(file => ({ ...file, type: fileType(file.fileType) })));
  }

  return results;
}
