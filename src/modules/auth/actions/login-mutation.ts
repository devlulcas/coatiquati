'use server';

import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import { auth } from '../services/lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fail, type Result } from '@/shared/lib/result';

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

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return fail('Nome de usuário ou senha incorretos');
  }

  const session = await auth.createSession(existingUser.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/');
}
