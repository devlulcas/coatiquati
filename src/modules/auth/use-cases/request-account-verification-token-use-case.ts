import { env } from '@/env';
import { VerifyAccountEmail } from '@/modules/email/components/verify-account-email';
import { emailToHtml } from '@/modules/email/lib/email-to-html';
import { mailer } from '@/modules/email/lib/mail';
import { log } from '@/modules/logging/lib/pino';
import { EmailVerificationService } from '../services/email-verification-service';
import type { Session } from '../types/session';
import { isAuthenticated } from '../utils/is';

export class RequestAccountVerificationTokenUseCase {
  constructor(private emailVerificationService: EmailVerificationService = new EmailVerificationService()) {}

  async execute(session: Session): Promise<{ message: string }> {
    if (!isAuthenticated(session)) {
      throw new Error('Usuário não autenticado. A confirmação de e-mail só pode ser feita por usuários autenticados.');
    }

    if (session.user.emailVerified) {
      return { message: 'Email já verificado.' };
    }

    const token = await this.emailVerificationService
      .generateEmailVerificationToken(session.user.userId)
      .catch(error => {
        log.error('Erro ao tentar gerar token de verificação de e-mail', { error });
        return null;
      });

    if (!token) {
      throw new Error('Erro ao gerar token.');
    }

    const emailVerificationURL = new URL('api/verify-account', env.NEXT_PUBLIC_WEBSITE);
    emailVerificationURL.searchParams.set('token', token);

    try {
      await mailer.sendMail(
        session.user.email,
        'Verificação de conta',
        emailToHtml(
          VerifyAccountEmail({
            name: session.user.username,
            url: emailVerificationURL.toString(),
          }),
        ),
      );

      return { message: 'Email enviado' };
    } catch (error) {
      log.error('Erro ao enviar email de verificação', { error });
      throw new Error('Erro ao enviar email de verificação.');
    }
  }
}
