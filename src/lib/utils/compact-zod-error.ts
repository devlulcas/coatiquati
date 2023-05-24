import type { ZodError } from 'zod';

export function compactZodError(error: ZodError): string {
	const messages = error.errors.map((error) => error.message);

	const intl = new Intl.ListFormat('pt-br');

	return intl.format(messages);
}
