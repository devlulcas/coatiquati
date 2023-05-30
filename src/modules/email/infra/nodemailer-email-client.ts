import { MAIL_FROM } from '$env/static/private';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import nodemailer from 'nodemailer';
import type { EmailClient, Mail } from './email-client';

type NodemailerOptions = {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
};

export class NodemailerEmailClient implements EmailClient {
	private transporter: nodemailer.Transporter;

	constructor(options: NodemailerOptions) {
		this.transporter = nodemailer.createTransport({
			host: options.host,
			port: options.port,
			secure: options.secure,
			auth: {
				user: options.user,
				pass: options.pass
			}
		});
	}

	async sendEmail(mail: Mail): Promise<ResultType<string | undefined>> {
		try {
			const info = await this.transporter.sendMail({
				from: MAIL_FROM,
				to: mail.to,
				subject: mail.subject,
				html: mail.body
			});

			console.log(info);
			return Ok(info.messageId);
		} catch (error) {
			console.error(error);
			return Fail('Falha ao enviar email');
		}
	}
}
