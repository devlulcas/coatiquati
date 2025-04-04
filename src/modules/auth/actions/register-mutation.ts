'use server';

import { env } from '@/env';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';
import { emailToHtml } from '@/modules/email/lib/email-to-html';
import { mailer } from '@/modules/email/lib/mail';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { hash } from 'argon2';
import { redirect } from 'next/navigation';
import { roles } from '../constants/roles';
import { createSession, generateSessionToken } from '../services/auth';
import { generateToken } from '../services/email-verification-service';
import { setSessionTokenCookie } from '../services/next';

export async function registerMutation(_: any, formData: FormData): Promise<Result> {
  const username = formData.get('username');
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return fail('Nome de usuário inválido');
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return fail('Senha inválida');
  }

  const email = formData.get('email');
  if (typeof email !== 'string' || email.length < 6 || email.length > 255) {
    return fail('Email inválido');
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    hashLength: 32,
    parallelism: 1,
  });

  const userId = crypto.randomUUID();
  const avatars = ['grape.png', 'mint.png', 'original.png', 'peach.png'];

  try {
    await db
      .insert(userTable)
      .values({
        id: userId,
        username,
        passwordHash: passwordHash,
        role: roles.USER,
        avatar: '/avatars/' + avatars[Math.floor(Math.random() * avatars.length)],
        bannedAt: null,
        verifiedAt: null,
        deletedAt: null,
        email,
      })
      .run();

    await sendVerificationEmail(userId, email, username);
    const token = generateSessionToken();
    const session = await createSession(token, userId);
    await setSessionTokenCookie(token, session.expiresAt);
    redirect('/');
  } catch (e) {
    log.error(e);
    return fail('Erro ao criar usuário, talvez o nome de usuário ou email já exista');
  }
}

async function sendVerificationEmail(id: string, email: string, username: string) {
  const token = await generateToken(id).catch(error => {
    log.error('Erro ao tentar gerar token de verificação de e-mail', { error });
    return null;
  });

  log.info('Token de verificação de e-mail gerado', { token });

  if (!token) {
    return fail('Erro ao tentar gerar token de verificação de e-mail.');
  }

  const emailVerificationURL = new URL('api/auth/verify-account', env.NEXT_PUBLIC_WEBSITE);
  emailVerificationURL.searchParams.set('token', token);

  try {
    await mailer.sendMail(
      email,
      'Verificação de conta',
      emailToHtml(
        VerifyAccountEmail({
          name: username,
          url: emailVerificationURL.toString(),
        }),
      ),
    );

    return ok('E-mail de verificação enviado com sucesso.');
  } catch (error) {
    log.error('Erro ao enviar email de verificação', { error });
    return fail('Erro ao enviar e-mail de verificação.');
  }
}
