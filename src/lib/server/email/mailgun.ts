import { MAIL_FROM } from '$env/static/private';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import InputFormData from 'form-data';
import Mailgun from 'mailgun.js';
import type { IMailgunClient } from 'mailgun.js/Interfaces';
import type { EmailClient, Mail } from './email-client';

export class MailgunEmailClientStrategy implements EmailClient {
	private mg: IMailgunClient;
	private mailgunApiKey: string;
	private mailgunDomain: string;

	constructor(apiKey: string, domain: string) {
		this.mailgunApiKey = apiKey;
		this.mailgunDomain = domain;

		const mailgun = new Mailgun(InputFormData);

		this.mg = mailgun.client({ username: 'api', key: this.mailgunApiKey });
	}

	async sendEmail(mail: Mail): Promise<ResultType<string | undefined>> {
		try {
			const response = await this.mg.messages.create(this.mailgunDomain, {
				from: MAIL_FROM,
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
