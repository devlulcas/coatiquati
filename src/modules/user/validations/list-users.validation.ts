import { Fail, Ok, type ResultType } from '$lib/types/result';
import { compactZodError } from '$lib/utils/compact-zod-error';
import { listUsersSchema, type ListUsersDTO } from '../dtos/list-users.dto';

export function validateListUsersSchema(data: unknown): ResultType<ListUsersDTO> {
	const result = listUsersSchema.safeParse(data);

	if (result.success === false) {
		return Fail(compactZodError(result.error));
	}

	return Ok(result.data);
}
