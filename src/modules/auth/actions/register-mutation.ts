'use server';

import { hash } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateId } from 'lucia';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { roles } from '../constants/roles';
import { auth } from '../services/lucia';
import { log } from '@/modules/logging/lib/pino';
import { EmailVerificationService } from '../services/email-verification-service';
import { fail, ok, type Result } from '@/shared/lib/result';
import { env } from '@/env';
import { mailer } from '@/modules/email/lib/mail';
import { emailToHtml } from '@/modules/email/lib/email-to-html';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';

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
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateId(15);
  const avatars = ['grape.png', 'mint.png', 'original.png', 'peach.png'];

  try {
    await db
      .insert(userTable)
      .values({
        id: userId,
        username,
        password_hash: passwordHash,
        role: roles.USER,
        avatar: '/avatars/' + avatars[Math.floor(Math.random() * avatars.length)],
        bannedAt: null,
        verifiedAt: null,
        deletedAt: null,
        email,
      })
      .run();

    const sentVerificationEmail = await sendVerificationEmail(userId, email, username);
    log.info('E-mail de verificação enviado', sentVerificationEmail);

    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (e) {
    log.error(e);

    return fail('Erro ao criar usuário, talvez o nome de usuário ou email já exista');
  }

  return redirect('/');
}

async function sendVerificationEmail(id: string, email: string, username: string) {
  const emailVerificationService = new EmailVerificationService();

  const token = await emailVerificationService.generateToken(id).catch(error => {
    log.error('Erro ao tentar gerar token de verificação de e-mail', { error });
    return null;
  });

  log.info('Token de verificação de e-mail gerado', { token });

  if (!token) {
    return fail('Erro ao tentar gerar token de verificação de e-mail.');
  }

  const emailVerificationURL = new URL('api/verify-account', env.NEXT_PUBLIC_WEBSITE);
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
