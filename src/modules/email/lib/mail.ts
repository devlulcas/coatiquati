import { env } from '@/env';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import nodemailer from 'nodemailer';

type MailTransport = {
  sendMail: (options: {
    from: string;
    to: string;
    subject: string;
    html: string | Promise<string>;
  }) => Promise<Result<unknown>>;
};

type MailTransporterFactory = () => MailTransport;

const createTransport: MailTransporterFactory = () => {
  const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  return {
    sendMail: async options => {
      try {
        const template = await options.html;
        const result = await transporter.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: template,
        });

        if (result.rejected.length > 0) {
          const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
          const rejected = result.rejected.map(r => (typeof r === 'string' ? r : r.address));
          return fail(`E-mail rejeitado: ${formatter.format(rejected)}`);
        }

        return ok(result);
      } catch (error) {
        log.error(error);

        if (error instanceof Error) {
          return fail(error.message);
        }

        return fail('Erro desconhecido ao enviar e-mail');
      }
    },
  };
};

/**
 * Cria um serviço de envio de e-mails
 * @param transporter Transporte de e-mails
 */
const createMailer = (transporter: MailTransport) => {
  return {
    sendMail: async (to: string, subject: string, html: string | Promise<string>) => {
      await transporter.sendMail({
        from: env.MAIL_FROM,
        to,
        subject,
        html,
      });
    },
  };
};

/**
 * Serviço de envio de e-mails criado a partir da configuração de ambiente
 */
export const mailer = createMailer(createTransport());
