import { env } from '@/env';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

type MailTransport = {
  sendMail: (options: { from: string; to: string; subject: string; html: string }) => Promise<unknown>;
};

const createProductionTransporter = (): MailTransport => {
  const resend = new Resend(env.MAIL_RESEND_API_KEY);
  return { sendMail: resend.emails.send };
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
