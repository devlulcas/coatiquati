import { roles } from '@/modules/auth/constants/roles';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { eq } from 'drizzle-orm';
import {
  setUserPermissionUseCaseSchema,
  type SetUserPermissionSchema,
} from '../schemas/set-user-permission-schema';
import { type User } from '../types/user';

export async function setUserPermissionUseCase(
  params: SetUserPermissionSchema
): Promise<User> {
  const validatedParams = setUserPermissionUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { userId, permission } = validatedParams.data;

  const newUser: Partial<User> = {
    role: permission === roles.ADMIN ? roles.ADMIN : roles.USER,
    updatedAt: new Date().toISOString(),
  };

  try {
    const data = db
      .update(userTable)
      .set(newUser)
      .where(eq(userTable.id, userId))
      .returning()
      .get();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
