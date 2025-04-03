'use server';

import { env } from '@/env';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';
import { emailToHtml } from '@/modules/email/lib/email-to-html';
import { mailer } from '@/modules/email/lib/mail';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok } from '@/shared/lib/result';
import { generateToken } from '../services/email-verification-service';
import { validateRequest } from '../services/next';

export async function requestEmailVerificationMutation() {
  const { data: user } = await validateRequest();

  if (!user) {
    return fail('Usuário não autenticado. A confirmação de e-mail só pode ser feita por usuários autenticados.');
  }

  if (user.verifiedAt) {
    return fail('O e-mail já foi verificado.');
  }

  const token = await generateToken(user.id).catch(error => {
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
      user.email,
      'Verificação de conta',
      emailToHtml(
        VerifyAccountEmail({
          name: user.username,
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
