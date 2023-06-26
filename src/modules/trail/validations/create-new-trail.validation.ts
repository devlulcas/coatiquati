import { Fail, Ok, type ResultType } from '$lib/types/result';
import { formDataToObject } from '$lib/utils/convert-form-data';
import { createTrailSchema, type CreateTrailDTO } from '../dtos/create-trail.dto';

export async function validateCreateNewTrail(
	request: Request
): Promise<ResultType<CreateTrailDTO>> {
	const formData = await request.formData();

	const data = formDataToObject(formData);

	const result = createTrailSchema.safeParse(data);

	if (result.success) {
		return Ok(result.data);
	}

	return Fail(result.error.errors[0].message);
}
