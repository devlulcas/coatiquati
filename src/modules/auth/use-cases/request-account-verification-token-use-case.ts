import { env } from '@/env';
import { log } from '@/modules/logging/lib/pino';
import { sendMail } from '@/modules/notification/lib/mail';
import { emailVerificationLinkMailTemplate } from '@/modules/notification/templates/mail';
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

    const emailVerificationURL = new URL('verify-account', env.NEXT_PUBLIC_WEBSITE);
    emailVerificationURL.searchParams.set('token', token);

    try {
      await sendMail(
        session.user.email,
        'Verificação de conta',
        emailVerificationLinkMailTemplate(session.user.username, emailVerificationURL.toString()),
      );

      return { message: 'Email enviado' };
    } catch (error) {
      log.error('Erro ao enviar email de verificação', { error });
      throw new Error('Erro ao enviar email de verificação.');
    }
  }
}
