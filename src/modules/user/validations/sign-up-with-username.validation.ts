import { Fail, Ok, type ResultType } from '$lib/types/result';
import { compactZodError } from '$lib/utils/compact-zod-error';
import {
	signUpWithUsernameSchema,
	type SignUpWithUsernameDTO
} from '../dtos/sign-up-with-username.dto';

export function validateSignUpWithUsername(data: unknown): ResultType<SignUpWithUsernameDTO> {
	const result = signUpWithUsernameSchema.safeParse(data);

	if (result.success === false) {
		return Fail(compactZodError(result.error));
	}

	if (
		result.data.password.toLowerCase().includes(result.data.username.toLowerCase()) ||
		result.data.username.toLowerCase().includes(result.data.password.toLowerCase())
	) {
		return Fail('A senha não pode conter o nome de usuário.');
	}

	if (
		result.data.email.toLowerCase().includes(result.data.password.toLowerCase()) ||
		result.data.password.toLowerCase().includes(result.data.email.toLowerCase())
	) {
		return Fail('A senha não pode conter o e-mail.');
	}

	return Ok(result.data);
}
