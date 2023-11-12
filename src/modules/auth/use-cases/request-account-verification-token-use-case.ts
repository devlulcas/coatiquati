import { env } from '@/env';
import { sendMail } from '@/modules/notification/lib/mail';
import { emailVerificationLinkMailTemplate } from '@/modules/notification/templates/mail';
import { DrizzleEmailVerificationTokenRepository } from '../repositories/email-verification-token-repository';
import { EmailVerificationService } from '../services/email-verification-service';
import type { Session } from '../types/session';
import { isAuthenticated } from '../utils/is';

export async function requestAccountVerificationTokenUseCase(session: Session): Promise<{ message: string }> {
  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

  if (session.user.emailVerified) {
    return { message: 'Email já verificado' };
  }

  const emailVerificationTokenRepository = new DrizzleEmailVerificationTokenRepository();
  const emailVerificationService = new EmailVerificationService(emailVerificationTokenRepository);

  const token = await emailVerificationService.generateEmailVerificationToken(session.user.userId).catch(error => {
    console.error(error);
    return null;
  });

  if (!token) {
    throw new Error('Erro ao gerar token');
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
    console.error(error);
    throw new Error('Erro ao enviar email de verificação');
  }
}
