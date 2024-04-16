import { env } from '@/env';
import Mailgun from 'mailgun.js';
import nodemailer from 'nodemailer';

type MailTransport = {
  sendMail: (options: { from: string; to: string; subject: string; html: string }) => Promise<unknown>;
};

const createProductionTransporter = (): MailTransport => {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: env.MAIL_MAILGUN_API_KEY });

  return {
    sendMail: async (options: { from: string; to: string; subject: string; html: string }) => {
      await mg.messages.create(env.MAIL_FROM, options);
    },
  };
};

const createDevelopmentTransporter = (): MailTransport => {
  const transporter = nodemailer.createTransport({
    host: env.DEV_MAIL_HOST,
    port: Number(env.DEV_MAIL_PORT),
    secure: false,
    auth: {
      user: env.DEV_MAIL_USER,
      pass: env.DEV_MAIL_PASS,
    },
  });

  return { sendMail: transporter.sendMail.bind(transporter) };
};

const createMailer = (transporter: MailTransport) => {
  return {
    sendMail: async (to: string, subject: string, html: string) => {
      await transporter.sendMail({
        from: env.MAIL_FROM,
        to,
        subject,
        html,
      });
    },
  };
};

export const mailer = createMailer(
  env.NODE_ENV === 'production' ? createProductionTransporter() : createDevelopmentTransporter(),
);
