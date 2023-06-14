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
import type { EmailClient } from './email-client';
import { MailgunEmailClientStrategy } from './mailgun';
import { NodemailerEmailClientStrategy } from './nodemailer';

const defineEmailClientStrategy = () => {
	if (MAIL_CLIENT === 'mailgun') {
		return new MailgunEmailClientStrategy(MAILGUN_API_KEY, MAILGUN_DOMAIN);
	}

	if (MAIL_CLIENT === 'nodemailer') {
		return new NodemailerEmailClientStrategy({
			host: NODEMAILER_HOST,
			port: parseInt(NODEMAILER_PORT, 10),
			secure: NODEMAILER_SECURE === 'true',
			pass: NODEMAILER_AUTH_PASS,
			user: NODEMAILER_AUTH_USER
		});
	}

	throw new Error('Invalid email client');
};

export const emailClient: EmailClient = defineEmailClientStrategy();
