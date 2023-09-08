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

  const user = await db.query.userTable.findFirst({
    columns: { role: true, email_verified: true },
    where: eq(userTable.id, userId),
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (user.email_verified === false) {
    throw new Error('Usuário não verificado');
  }

  if (user.role === roles.HIGH_PRIVILEGE_ADMIN) {
    throw new Error(
      'Não é possível alterar a permissão de um administrador de nível alto'
    );
  }

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
