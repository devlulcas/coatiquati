'use server';

import { env } from '@/env';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';
import { emailToHtml } from '@/modules/email/lib/email-to-html';
import { mailer } from '@/modules/email/lib/mail';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok } from '@/shared/lib/result';
import { EmailVerificationService } from '../services/email-verification-service';
import { validateRequest } from '../services/lucia';
import { isAuthenticated } from '../utils/is';

export async function requestEmailVerificationMutation() {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Usuário não autenticado. A confirmação de e-mail só pode ser feita por usuários autenticados.');
  }

  if (user.verifiedAt) {
    return fail('O e-mail já foi verificado.');
  }

  const emailVerificationService = new EmailVerificationService();

  const token = await emailVerificationService.generateToken(user.id).catch(error => {
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