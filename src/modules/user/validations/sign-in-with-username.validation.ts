import { Fail, Ok, type ResultType } from '$lib/types/result';
import { compactZodError } from '$lib/utils/compact-zod-error';
import {
	signInWithUsernameSchema,
	type SignInWithUsernameDTO
} from '../dtos/sign-in-with-username.dto';

export function validateSignInWithUsername(data: unknown): ResultType<SignInWithUsernameDTO> {
	const result = signInWithUsernameSchema.safeParse(data);

	if (result.success === false) {
		return Fail(compactZodError(result.error));
	}

	return Ok(result.data);
}
