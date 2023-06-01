import type { Optional } from '$lib/types/optional';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { compactZodError } from '$lib/utils/compact-zod-error';
import {
	signInWithOAuthProviderSchema,
	type SignInWithOAuthProviderDTO
} from '../dtos/sign-in-with-oauth-provider.dto';

export function validateSignInWithOAuthProvider(
	data: Optional<SignInWithOAuthProviderDTO>
): ResultType<SignInWithOAuthProviderDTO> {
	const result = signInWithOAuthProviderSchema.safeParse(data);

	if (result.success === false) {
		return Fail(compactZodError(result.error));
	}

	if (result.data.state !== result.data.storedState) {
		return Fail('O estado não corresponde ao estado armazenado.');
	}

	return Ok(result.data);
}
