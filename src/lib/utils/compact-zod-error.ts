import type { ValidationErrors } from 'sveltekit-superforms/index';
import type { ZodError, ZodObject, ZodRawShape } from 'zod';

export function compactZodError(error: ZodError): string {
	const messages = error.errors.map((error) => error.message);

	const intl = new Intl.ListFormat('pt-br');

	return intl.format(messages);
}

export function compactZodValidationErrors(errors: ValidationErrors<ZodObject<ZodRawShape>>): string {
	let messages: string[] = [];

	for (const key in errors) {
		const error = errors[key];
		if (error) {
			messages = [...messages, ...error];
		}
	}

	const intl = new Intl.ListFormat('pt-br');

	if (!messages) return '';

	return intl.format(messages);
}
