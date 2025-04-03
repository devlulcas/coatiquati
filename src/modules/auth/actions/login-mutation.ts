'use server';

import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import { fail, type Result } from '@/shared/lib/result';
import { verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { createSession, generateSessionToken } from '../services/auth';
import { setSessionTokenCookie } from '../services/next';

export async function loginMutation(_: any, formData: FormData): Promise<Result> {
  const username = formData.get('username');

  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return fail('Nome de usuário inválido');
  }

  const password = formData.get('password');

  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return fail('Senha inválida');
  }

  const existingUser = await db.select().from(userTable).where(eq(userTable.username, username)).get();

  if (!existingUser) {
    return fail('Nome de usuário ou senha incorretos');
  }

  const validPassword = await verify(existingUser.passwordHash, password);

  if (!validPassword) {
    return fail('Nome de usuário ou senha incorretos');
  }

  const token = generateSessionToken();
  const session = await createSession(token, existingUser.id);
  await setSessionTokenCookie(token, session.expiresAt);
  redirect(createProfileUrl(existingUser.username));
}
