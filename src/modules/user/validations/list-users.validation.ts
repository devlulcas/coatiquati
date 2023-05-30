import { Fail, Ok, type ResultType } from '$lib/types/result';
import { compactZodError } from '$lib/utils/compact-zod-error';
import { listUsersDTOSchema, type ListUsersDTO } from '../dtos/list-users.dto';

export function validateListUsersDTOSchema(data: unknown): ResultType<ListUsersDTO> {
	const result = listUsersDTOSchema.safeParse(data);

	if (result.success === false) {
		return Fail(compactZodError(result.error));
	}

	return Ok(result.data);
}
