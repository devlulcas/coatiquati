import { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM } from '$env/static/private';
import Mailgun from 'mailgun.js';
import InputFormData from 'form-data';
import type Client from 'mailgun.js/client';
import { Fail, Ok, type ResultType } from '$lib/types/result';

type Mail = {
	to: string;
	subject: string;
	body: string;
};

export interface EmailClient {
	sendEmail(mail: Mail): Promise<ResultType<string | undefined>>;
}

export class MailgunEmailClient implements EmailClient {
	private mg: Client | undefined;

	constructor() {
		const mailgun = new Mailgun(InputFormData);
		this.mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });
	}

	async sendEmail(mail: Mail): Promise<ResultType<string | undefined>> {
		try {
			const response = await this.mg?.messages.create(MAILGUN_DOMAIN, {
				from: MAILGUN_FROM,
				to: [mail.to],
				subject: mail.subject,
				html: mail.body
			});

			console.log(response);

			return Ok(response?.message);
		} catch (error) {
			console.error(error);

			return Fail('Falha ao enviar email');
		}
	}
}
