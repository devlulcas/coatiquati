import { env } from '@/env';
import { createSendEmailCommand, sesClient } from '@/modules/aws/lib/ses-client';
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

/**
 * Implementação de transporte de e-mail para produção usando AWS SES
 * Substitua este transporte por alguma alternativa do seu gosto caso não seja possível usar AWS SES
 * @see https://nodemailer.com/transports/
 */
const createProductionTransporter: MailTransporterFactory = () => {
  return {
    sendMail: async options => {
      try {
        const template = await options.html;
        const sendEmailCommand = createSendEmailCommand({
          destination: { toAddresses: [options.to] },
          message: { body: { html: { data: template } }, subject: { data: options.subject } },
          source: options.from,
        });

        const result = await sesClient.send(sendEmailCommand);
        log.info(result);

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
 * Implementação de transporte de e-mail para desenvolvimento
 * Substitua este transporte por alguma alternativa do seu gosto caso não seja possível usar AWS SES
 */
const createDevelopmentTransporter: MailTransporterFactory = () => {
  const transporter = nodemailer.createTransport({
    host: env.DEV_MAIL_HOST,
    port: Number(env.DEV_MAIL_PORT),
    secure: false,
    auth: {
      user: env.DEV_MAIL_USER,
      pass: env.DEV_MAIL_PASS,
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
export const mailer = createMailer(
  env.MAIL_ENV === 'production' ? createProductionTransporter() : createDevelopmentTransporter(),
);
