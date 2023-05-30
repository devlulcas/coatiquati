import {
	MAILGUN_API_KEY,
	MAILGUN_DOMAIN,
	MAIL_CLIENT,
	NODEMAILER_AUTH_PASS,
	NODEMAILER_AUTH_USER,
	NODEMAILER_HOST,
	NODEMAILER_PORT,
	NODEMAILER_SECURE
} from '$env/static/private';
import { MailgunEmailClient } from '../../modules/email/infra/mailgun-emai-client';
import { NodemailerEmailClient } from '../../modules/email/infra/nodemailer-email-client';

const getMailClient = () => {
	if (MAIL_CLIENT === 'nodemailer') {
		return new NodemailerEmailClient({
			host: NODEMAILER_HOST,
			port: parseInt(NODEMAILER_PORT, 10),
			secure: NODEMAILER_SECURE === 'true',
			pass: NODEMAILER_AUTH_PASS,
			user: NODEMAILER_AUTH_USER
		});
	}

	if (MAIL_CLIENT === 'mailgun') {
		return new MailgunEmailClient(MAILGUN_API_KEY, MAILGUN_DOMAIN);
	}

	throw new Error('Invalid mail client');
};

export const emailClient = getMailClient();
