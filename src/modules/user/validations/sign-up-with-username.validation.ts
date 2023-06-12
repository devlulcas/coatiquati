import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { SignUpWithUsernameDTO } from '../dtos/sign-up-with-username.dto';

export function validateSignUpWithUsername(
	data: SignUpWithUsernameDTO
): ResultType<SignUpWithUsernameDTO> {
	if (
		data.password.toLowerCase().includes(data.username.toLowerCase()) ||
		data.username.toLowerCase().includes(data.password.toLowerCase())
	) {
		return Fail('A senha não pode conter o nome de usuário.');
	}

	if (
		data.email.toLowerCase().includes(data.password.toLowerCase()) ||
		data.password.toLowerCase().includes(data.email.toLowerCase())
	) {
		return Fail('A senha não pode conter o e-mail.');
	}

	return Ok(data);
}
