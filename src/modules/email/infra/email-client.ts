import type { ResultType } from '$lib/types/result';

export type Mail = {
	to: string;
	subject: string;
	body: string;
};

export interface EmailClient {
	sendEmail(mail: Mail): Promise<ResultType<string | undefined>>;
}
